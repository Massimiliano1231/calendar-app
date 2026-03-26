const User = require('../models/User');
const bcrypt = require("bcryptjs");



exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Nome utente già esistente' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    const savedUser = await newUser.save();

    console.log("registrato") ;


    res.status(201).json(savedUser);
  } catch (error) {
    console.log("errore registrazione server:" , error) ;
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }
};




