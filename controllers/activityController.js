const Activity = require('../models/Activity');
const User = require('../models/User');
const { sendReminderEmail } = require('../services/emailService');
const timeMachineConfig = require('../timeMachineConfig');


exports.createActivity = async (req, res) => {
  try {
    const { title, description, deadline, author, email, completed, type , participants } = req.body;

    if (type === 'gruppo' && (!participants || participants.length === 0)) {
      return res.status(400).json({ error: 'Per le attività di gruppo, specifica almeno un partecipante.' });
    }
    
    const newActivity = new Activity({
      title,
      description,
      deadline,
      author,
      email,
      completed,
      type,
       participants: type === 'gruppo' ? participants : [] 
    });

    const savedActivity = await newActivity.save();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    

    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'attività' });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const activities = await Activity.find({
      $or: [
        { author: username },
        { participants: username }
      ]
    });

    

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
};

exports.getLastActivity = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const activity = await Activity.findOne({
      $or: [
        { author: username },
        { participants: username }
      ]
    }).sort({ _id: -1 });

    res.status(200).json(activity);
  } catch (error) {
    console.error('Errore durante il recupero dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
};


const getUpcomingActivities = async (username) => {
  const timeMachineDate = getTimeMachineDate(); 
  const today = new Date(timeMachineDate);  
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  return await Activity.find({
    $or: [
      { author: username },
      { participants: username }
    ],
    deadline: {
      $gte: today,  
      $lte: twoDaysLater  
    }
  });
};




exports.getCurrentDayActivities = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setDate(currentDate.getDate() + 1);
    endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

    const activities = await Activity.find({
      $or: [
        { author: username, deadline: { $gte: currentDate, $lte: endOfDay } },
        { participants: username, deadline: { $gte: currentDate, $lte: endOfDay } }
      ]
    });

    if (activities.length === 0) {
      return res.status(200).json({ message: 'Nessuna attività trovata per oggi' });
    }

    res.json(activities);
  } catch (error) {
    console.error('Errore nel recupero delle attività del giorno corrente:', error);
    res.status(500).json({ error: 'Errore nel recupero delle attività del giorno corrente' });
  }
};




exports.getActivitiesByDate = async (req, res) => {
  try {
    const { author, date } = req.query;

    if (!author || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' }); 
    }

    const startDate = new Date(date).setHours(0, 0, 0, 0);
    const endDate = new Date(date).setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      $or: [
        { author, deadline: { $gte: startDate, $lte: endDate } },
        { participants: author, deadline: { $gte: startDate, $lte: endDate } },
      ],
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Errore nel recupero delle attività:', error);
    res.status(500).json({ error: 'Errore del server durante il recupero delle attività' });
  }
};




exports.markCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.username;

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: 'Attività non trovata' });
    }

    if (activity.author !== user && !activity.participants.includes(user)) {
      return res.status(403).json({ error: 'Non sei autorizzato a completare questa attività' });
    }

    activity.completed = true;
    await activity.save();

    res.status(200).json({ message: 'Attività completata con successo', activity });
  } catch (error) {
    console.error('Errore nel completare l\'attività:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};


exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: 'Attività non trovata' });
    }

    activity.completed = completed;
    await activity.save();

    res.status(200).json({ message: 'Attività aggiornata con successo', activity });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'attività:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};


exports.getOverdueActivities = async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const today = new Date(timeMachineConfig.getTimeMachineDate().getTime() - (new Date().getTimezoneOffset() * 60000));

    const overdueActivities = await Activity.find({
      completed: false,
      deadline: { $lt: today },
      $or: [
        { author: username },
        { participants: username },
      ],
    });

    res.status(200).json(overdueActivities);
  } catch (error) {
    console.error('Errore nel recupero delle attività scadute:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};




exports.deleteActivities = async (req, res) => {
  try {
    const activityID = req.params.id;
    const username = req.query.username; 

    const activity = await Activity.findById(activityID);

    if (!activity) {
      return res.status(404).json({ message: 'Attività non trovata' });
    }

    if (activity.author === username) {
      await Activity.findByIdAndDelete(activityID);
      return res.json({ message: 'Attività eliminata con successo' });
    } else {
      activity.participants = activity.participants.filter(
        (participant) => participant !== username
      );
      await activity.save();
      return res.json({ message: 'Utente rimosso dai partecipanti' });
    }
  } catch (error) {
    console.error('Errore nella cancellazione della attività:', error);
    res.status(500).send('Errore nella cancellazione della attività');
  }
};

