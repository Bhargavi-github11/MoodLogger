const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true, enum: ['Happy', 'Neutral', 'Sad', 'Angry', 'Tired'] },
  note: { type: String, default: '' },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mood', MoodSchema);
