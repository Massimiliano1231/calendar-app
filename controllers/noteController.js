const Note = require('../models/note');


exports.getAllNotes = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const notes = await Note.find({
      $or: [
        { access: "public" },
        { author: username },
        { access: "restricted", allowedUsers: username }
      ]
    });

    res.json(notes);
  } catch (error) {
    console.error('Errore nel recupero delle note:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle note' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {

      return res.status(404).json({ message: 'Nota non trovata' });
    }
    res.json(note);
  } catch (error) {
    console.error('Errore nel recupero della nota:', error);
    res.status(500).json({ message: 'Errore nel recupero della nota' });
  }
};



exports.createNote = async (req, res) => {
  try {
    const { heading, author, content, completed, access, allowedUsers } = req.body;

    const newNote = new Note({
      heading,
      author,
      content,
      completed,
      access,
      allowedUsers: access === "restricted" ? allowedUsers : []
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Errore nella creazione della nota:', error);
    res.status(500).send('Errore nella creazione della nota');
  }
};



exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const username = req.body.username;  

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota non trovata' });
    }


    if (note.author !== username) {
      return res.status(403).json({ message: 'Solo l\'autore può modificare questa nota' });
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della nota:', error);
    res.status(500).send('Errore nell\'aggiornamento della nota');
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const username = req.body.username;  

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota non trovata' });
    }


    if (note.author === username) {
      await Note.findByIdAndDelete(noteId);
      return res.json({ message: 'Nota eliminata con successo' });
    } else if (note.allowedUsers.includes(username)) {
      note.allowedUsers = note.allowedUsers.filter(user => user !== username);
      await note.save();
      return res.json({ message: 'Accesso rimosso dalla nota per l\'utente' });
    } else {
      return res.status(403).json({ message: 'Non hai i permessi per eliminare questa nota' });
    }
  } catch (error) {
    console.error('Errore nella cancellazione della nota:', error);
    res.status(500).send('Errore nella cancellazione della nota');
  }
};



exports.getLastNote = async (req, res) => {
  try {
    const username = req.query.author;
    const lastNote = await Note.findOne({ author: username }).sort({ createdAt: -1 });
    res.json(lastNote);
  } catch (error) {
    console.error('Errore nel recupero dell\'ultima nota:', error);
    res.status(500).send('Errore nel recupero dell\'ultima nota');
  }
};


