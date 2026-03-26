const Pom = require('../models/pom');
const User = require('../models/User');
const notificationPom = require('../models/notificationPom');
const timeMachineConfig = require('../timeMachineConfig');
const moment = require('moment-timezone');

exports.createPom = async (req, res) => {
  try {
    const { username, tempoStudio, tempoPausa, ripetizioni, giorno, cicliRimanenti, remainingTime, isStudyPhase, studyCycles } = req.body;
    const newPom = new Pom({
      username,
      tempoStudio,
      tempoPausa,
      ripetizioni,
      giorno, 
      cicliRimanenti, 
      remainingTime, 
      isStudyPhase, 
      studyCycles
    });

    const savedPom = await newPom.save();
    res.status(201).json(savedPom);
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendNotificationPom = async (req, res) => {
  const { username, tempoStudio, tempoPausa, ripetizioni, destinatario, giorno } = req.body;

  if (!destinatario || destinatario.length === 0) {
    return res.status(400).json({ message: 'I destinatari sono necessari' });
  }

  try {
    const users = [];
    for (const recipientId of destinatario) {
      const user = await User.findById(recipientId);
      if (user) {
        users.push(user._id); 
      }
    }

    if (users.length === 0) {
      return res.status(404).json({ message: 'Nessun destinatario valido trovato' });
    }

    const newNotificationPom = new notificationPom({
      username,
      tempoStudio,
      tempoPausa,
      ripetizioni,
      destinatario: users, 
      giorno,
    });

    await newNotificationPom.save();

    res.status(200).json({ message: 'Notifica inviata con successo' });

  } catch (error) {
    console.error('Errore durante l\'invio della notifica pomodoro:', error);
    res.status(500).json({ message: 'Errore durante l\'invio della notifica pomodoro' });
  }
};


exports.getNotifichePom = async (req,res) =>{
  
  const userId = req.user.id; 
  if (!userId) {return res.status(400).json({ message: 'userId mancante' }); }


  try {
    const notificationsPom = await notificationPom.find({ destinatario: userId }).sort({ createdAt: -1 }); 
    res.status(200).json(notificationsPom);
} catch (error) {
    console.error('Errore durante il recupero delle notifiche:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle notifiche' });
}

};


exports.rifiutaNotifica = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await notificationPom.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notifica non trovata' });
    }

    res.status(200).json({ message: 'Notifica eliminata con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della notifica:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione della notifica' });
  }
};







exports.getPoms = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const poms = await Pom.find({ username });
    res.status(200).json(poms);
  } catch (error) {
    console.error('Errore durante il recupero delle sessioni Pomodoro:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle sessioni Pomodoro' });
  }
};


exports.getLastPom = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const pom = await Pom.findOne({ username }).sort({ createdAt: -1 });
    res.status(200).json(pom);
  } catch (error) {
    console.error('Errore durante il recupero dell\'ultima sessione Pomodoro:', error);
    res.status(500).json({ error: 'Errore durante il recupero dell\'ultima sessione Pomodoro' });
  }
};

exports.getPomodorosByDate = async (req, res) => {
  try {
    const { username, date } = req.query;
    if (!username || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const pomodoros = await Pom.find({
      username,
      giorno: { $gte: startDate, $lte: endDate }
    });

  

    const formattedPomodoros = pomodoros.map(pomodoro => ({
      ...pomodoro.toObject(),
      giorno: pomodoro.giorno ? pomodoro.giorno.toISOString() : null
    }));

    res.json(formattedPomodoros);
  } catch (error) {
    console.error('Errore nel recupero delle sessioni Pomodoro:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sessioni Pomodoro' });
  }
};

exports.saveUncompletedPom = async (req, res) => {
  try {
    const { username, giorno, remainingTime, isStudyPhase, studyCycles, tempoStudio, tempoPausa, ripetizioni } = req.body;

    if (!giorno) {
      return res.status(400).json({ error: "Il campo 'giorno' è obbligatorio e non può essere nullo." });
    }

    const startDate = new Date(giorno);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(giorno);
    endDate.setHours(23, 59, 59, 999);

    let pomodoro = await Pom.findOneAndUpdate(
      { username, giorno: { $gte: startDate, $lte: endDate } },
      { remainingTime, isStudyPhase, studyCycles, giorno: new Date(giorno), tempoStudio, tempoPausa, ripetizioni },
      { new: true, upsert: true }
    );
   
    res.status(200).json({ message: 'Sessione incompleta salvata', pomodoro });
  } catch (error) {
    console.error('Errore nel salvataggio della sessione incompleta:', error);
    res.status(500).json({ error: 'Errore nel salvataggio della sessione incompleta' });
  }
};


exports.getUncompletedPomodoros = async (req, res) => {
  
  try {
    const username = req.query.username.trim();
    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const pomodoro = await Pom.findOne({ username, remainingTime: { $gt: 0 } }).sort({ updatedAt: -1 });
    
    if (pomodoro) {
      res.status(200).json(pomodoro);
    } else {
      res.status(200).json({ message: 'Nessuna sessione incompleta trovata' });
    }
  } catch (error) {
    console.error('Errore nel recupero delle sessioni incompleta:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sessioni incompleta' });
  }
};


exports.deletePom = async (req, res) => {

  try {
    const pomID = req.params.id;
    const result = await Pom.findByIdAndDelete(pomID);

    if (!result) {
      return res.status(404).json({ message: 'Pom non trovato' });
    }

    res.json({ message: 'pom eliminata con successo' });
  } catch (error) {
    console.error('Errore nella cancellazione del pomodoro:', error);
    res.status(500).send('Errore nella cancellazione del pomodoro');
  }
};


exports.iniziaPomodoro = async (req, res) => {
  try {
    const id  = req.params.id; 

    const pomodoro = await Pom.findById(id);

    if (!pomodoro) {
      return res.status(404).json({ success: false, message: 'Pomodoro non trovato' });
    }

    if (!pomodoro.isStarted) {
      pomodoro.isStarted = true;

      await pomodoro.save();

      return res.status(200).json({ success: true, message: 'Pomodoro avviato con successo' });
    } else {
      return res.status(400).json({ success: false, message: 'Questo pomodoro è già iniziato' });
    }
  } catch (error) {
    console.error("Errore durante l'avvio del pomodoro:", error);
    return res.status(500).json({ success: false, message: 'Errore interno del server' });
  }
};







const getTimeMachineDate1 = async () => {
  const rawDate = timeMachineConfig.getTimeMachineDate();
  const isoDate = moment(rawDate).toISOString(); 
  return moment(isoDate).tz('Europe/Rome');
};




exports.pomNonPartiti = async (req, res) => {
  try {
      const currentDate = await getTimeMachineDate1();
      const username = req.query.username; 

      if (!username) {
          return res.status(400).json({ error: 'Username non fornito.' });
      }

      const startOfDay = currentDate.clone().startOf('day');

      const pomodoriNonPartiti = await Pom.find({
          isStarted: false,
          giorno: { $lt: startOfDay.toDate() },
          username: username,
      });


      if (pomodoriNonPartiti.length === 0) {
          return res.status(200).json({ message: 'Nessun pomodoro non avviato trovato.' });
      }

      res.status(200).json(pomodoriNonPartiti);
  } catch (error) {
      console.error('Errore:', error);
      res.status(500).json({ error: 'Errore nel recupero dei pomodori non avviati' });
  }
};














