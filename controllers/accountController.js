const User = require('../models/User');
const bcrypt = require("bcryptjs");


exports.updatePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password attuale errata' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (error) {
    console.error('Errore nel recupero degli utenti:', error);
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
};

