const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mood = require('../models/Mood');

// GET all moods
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET last 7 days moods
router.get('/week', auth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const moods = await Mood.find({ 
      userId: req.user.id, 
      date: { $gte: oneWeekAgo } 
    }).sort({ date: 1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/moods/score
router.get('/score', auth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const moods = await Mood.find({ userId: req.user.id, date: { $gte: oneWeekAgo } });
    
    const values = { Happy: 2, Neutral: 0, Sad: -1, Angry: -2, Tired: -1 };
    const score = moods.reduce((acc, m) => acc + (values[m.mood] || 0), 0);
    res.json({ weeklyScore: score });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET /api/moods/insights
router.get('/insights', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id });
    if (moods.length === 0) return res.json({ topMood: 'None', topTrigger: 'None', insight: 'Not enough data yet' });

    const moodCounts = {};
    const tagCounts = {};
    const moodValues = { Happy: 2, Neutral: 0, Sad: -1, Angry: -2, Tired: -1 };
    const dayCounts = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };

    moods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      (m.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 });
      
      const val = moodValues[m.mood] || 0;
      if (val > 0) {
        dayCounts[new Date(m.date).getDay()] += val;
      }
    });

    const topMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, 'Unknown');
    const topTrigger = Object.keys(tagCounts).length > 0 ? Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b) : 'Nothing specific';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDayIndex = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b, 0);
    const happiestDay = days[bestDayIndex];

    res.json({
      topMood,
      topTrigger,
      insight: `You feel ${topMood} mostly due to ${topTrigger}. Your happiest day is ${happiestDay}.`
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST add or update mood
router.post('/', auth, async (req, res) => {
  try {
    const { mood, note, tags } = req.body;
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let moodEntry = await Mood.findOne({
      userId: req.user.id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (moodEntry) {
      return res.status(400).json({ msg: 'You have already logged your mood for today!' });
    }

    moodEntry = new Mood({
      userId: req.user.id,
      mood,
      note: note || '',
      tags: tags || [],
      date: new Date()
    });
    await moodEntry.save();
    res.json(moodEntry);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE mood
router.delete('/:id', auth, async (req, res) => {
  try {
    const moodEntry = await Mood.findById(req.params.id);
    if (!moodEntry) return res.status(404).json({ msg: 'Mood not found' });
    
    if (moodEntry.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await moodEntry.deleteOne();
    res.json({ msg: 'Mood removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
