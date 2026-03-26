const mongoose = require('mongoose');

const notificationPomSchema = new mongoose.Schema({
    username: {type: String, required: true },
    destinatario: {type: String, required: true},
    tempoStudio: {type: Number, required: true},
    tempoPausa: {type: Number, required: true},
    ripetizioni: {type: Number, required: true},
    destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    giorno: {type: Date, required: true},    
}, { timestamps: true });


module.exports = mongoose.model("notificationPom", notificationPomSchema);


