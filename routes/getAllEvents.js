const Event = require('../models/Event'); 
const express = require('express');
const router = express.Router();

// Definizione della funzione getAllEvents
const getAllEvents = async () => {
    try {
      const events = await Event.find();
      return events;
    } catch (error) {
      console.error('Errore nel recupero degli eventi:', error);
      return { error: 'Errore nel recupero degli eventi' };
    }
  };
  
  module.exports = { getAllEvents };
  
