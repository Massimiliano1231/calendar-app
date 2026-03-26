const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const unavailableTimeSchema = new mongoose.Schema({
    startHour: { type: Number, required: true, min: 0, max: 23 },
    startMinute: { type: Number, required: true, min: 0, max: 59 },
    endHour: { type: Number, required: true, min: 0, max: 23 },
    endMinute: { type: Number, required: true, min: 0, max: 59 },
    giorno: { type: Date},
    repeatDaily: { type: Boolean, required: true, default: false } 
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    unavailableTimes: { type: [unavailableTimeSchema], default: [] } 
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
