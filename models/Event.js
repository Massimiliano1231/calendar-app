const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, 
    required: true,
  },
  duration: {
    type: Number, 
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom', 'one-time'],
    default: 'one-time',
  },
  recurrencePattern: {
    type: String,
    default: '', 
  },
  numberOfOccurrences: {
    type: Number,
    default: null, 
  },
  notificationMechanism: { 
    type: [String],
    enum: ['no', 'email', 'alert'],
    default: [],
  },
  notificationTime: {
    type: Number, 
    default: 0,
  },
  repeatNotification: {
    type: Number, 
    default: 0,
  },
  email: { 
    type: String, 
    required: true 
  },
  
  author: {
    type: String,
    required: true,
  },
  type:
   { type: String, 
    enum: ['singola', 'gruppo'], 
    default: 'singola' },

  participants: [{ type: String }],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
