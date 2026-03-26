const Event = require('../models/Event');
const { sendNotifEmail } = require('../services/emailService');
const User = require('../models/User');
const { getTimeMachineDate } = require('../controllers/timeMachineController');

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      duration,
      isRecurring,
      frequency,
      email,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism,
      notificationTime,
      repeatNotification,
      participants,
      type,
    } = req.body;

    if (!title || !date || !startTime || !author) {
      return res.status(400).json({ error: 'I campi titolo, data, ora di inizio e autore sono obbligatori.' });
    }

    const notificationMechanismArray = Array.isArray(notificationMechanism)
      ? notificationMechanism
      : notificationMechanism?.split(',') || [];

    const createAndSaveEvent = async (eventDate) => {
      try {
        const newEvent = new Event({
          title,
          description,
          date: eventDate,
          startTime,
          duration,
          isRecurring,
          frequency,
          email,
          numberOfOccurrences,
          location,
          author,
          notificationMechanism: notificationMechanismArray,
          notificationTime,
          repeatNotification,
          participants: type === 'gruppo' ? participants : [],
          type,
        });

        const savedEvent = await newEvent.save();
        return savedEvent;
      } catch (error) {
        if (error.code === 11000) {
          console.error('Errore: Evento duplicato', error);
          return null;
        }
        throw error;
      }
    };

    if (isRecurring) {
      const events = [];
      const startDate = new Date(date);

      for (let i = 0; i < numberOfOccurrences; i++) {
        const newDate = new Date(startDate);

        switch (frequency) {
          case 'daily':
            newDate.setDate(startDate.getDate() + i);
            break;
          case 'weekly':
            newDate.setDate(startDate.getDate() + i * 7);
            break;
          case 'monthly':
            newDate.setMonth(startDate.getMonth() + i);
            break;
          default:
            return res.status(400).json({ error: 'Frequenza non supportata' });
        }

        const savedEvent = await createAndSaveEvent(newDate.toISOString());eateAndSaveEvent(newDate.toISOString());
        if (savedEvent) {
          events.push(savedEvent);
        }
      }

      return res.status(201).json(events);
    }

    const newEvent = new Event({
      title,
      description,
      date,
      startTime,
      duration,
      isRecurring,
      frequency,
      email,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism: notificationMechanismArray,
      notificationTime,
      repeatNotification,
      participants: type === 'gruppo' ? participants : [],
      type,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);

  } catch (error) {
    console.error('Errore durante creazione evento:', error);
    res.status(500).json({ error: 'Errore durante creazione evento' });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const events = await Event.find({
      $or: [
        { author: author },
        { participants: author }
      ]
    });
    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

exports.getLastEvent = async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const event = await Event.findOne({

      $or: [
        { author: author },
        { participants: author }
      ]
    }).sort({ _id: -1 });


    res.status(200).json(event);
  } catch (error) {
    console.error('Errore nel recupero dell\'evento:', error);
    res.status(500).json({ error: 'Errore nel recupero dell\'evento' });
  }
};



exports.getCurrentDayEvents = async (req, res) => {
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
    

    const events = await Event.find({
      $or: [
        { author: username, date: { $gte: currentDate, $lte: endOfDay } },
        { participants: username, date: { $gte: currentDate, $lte: endOfDay } }
      ]
    });

    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi del giorno corrente:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi del giorno corrente' });
  }
};




exports.getEventByDate = async (req, res) => {
  try {
    const { author, date } = req.query;
    if (!author || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const events = await Event.find({
      $or: [
        { author, date: { $gte: startDate, $lte: endDate } },
        { participants: author, date: { $gte: startDate, $lte: endDate } },
      ],
    });

    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

exports.deleteEvents = async (req, res) => {
  try {
    const eventID = req.params.id;
    const username = req.query.username;

    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    if (event.author === username) {
      await Event.findByIdAndDelete(eventID);
      return res.json({ message: 'Evento eliminato con successo' });
    } else {
      event.participants = event.participants.filter(
        (participant) => participant !== username
      );
      await event.save();
      return res.json({ message: 'Utente rimosso dai partecipanti' });
    }
  } catch (error) {
    console.error('Errore nella cancellazione di evento:', error);
    res.status(500).send('Errore nella cancellazione di evento');
  }
};



exports.nonDisponibile = async (req, res) => {
  try {
    const { startHour, startMinute, endHour, endMinute, repeatDaily, giorno } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user.unavailableTimes.push({
      startHour,
      startMinute,
      endHour,
      endMinute,
      repeatDaily,
      giorno
    });

    await user.save();

    res.status(200).json({ message: 'Indisponibilità aggiunta con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

exports.nonDisponibileGET = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    return res.status(200).json(user.unavailableTimes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.rimNonDisponibile = async (req, res) => {
  try {
    const username = req.query.username;
    const id = req.query.id;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const unavailableTimeIndex = user.unavailableTimes.findIndex(time => time.id === id);

    if (unavailableTimeIndex === -1) {
      return res.status(404).json({ message: 'Tempo non disponibile non trovato' });
    }

    user.unavailableTimes.splice(unavailableTimeIndex, 1);

    await user.save();

    return res.status(200).json({ message: 'Tempo non disponibile eliminato con successo' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};







