const mongoose = require('mongoose');

const pomSchema = new mongoose.Schema({
    username: {type: String, required: true },
    tempoStudio: {type: Number, required: true},
    tempoPausa: {type: Number, required: true},
    ripetizioni: {type: Number, required: true},
    giorno: {type: Date, required: true},
    remainingTime: { type: Number, default: 0 },   
    isStudyPhase: { type: Boolean, default: true }, 
    studyCycles: { type: Number, default: 0 }, 
    ripetizioni: { type: Number },
    isStarted: {type: Boolean, default: false},
}, { timestamps: true });


module.exports = mongoose.model("Pom", pomSchema);
