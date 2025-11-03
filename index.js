const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Boss Data Schema
const bossDataSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const BossData = mongoose.model('BossData', bossDataSchema);

// Routes

// Get boss data
app.get('/api/boss-data', async (req, res) => {
  try {
    let bossData = await BossData.findOne().sort({ updatedAt: -1 });
    
    // If no data exists, create initial data
    if (!bossData) {
      const initialData = `============================================================
RubinOT Boss Kill Tracker - Lunarian
Last Updated: 03/11/2025, 10:25:24
============================================================
Total Bosses Tracked: 96
Bosses Killed Today: 0
============================================================

Boss: Arthom the Hunter
Total Days Spawned: 0
Total Kills: 0
Average Days Between Spawns: N/A (need 2+ spawns)
Next Expected Spawn: N/A
Last Kill Date: Never
History: None
---`;
      
      bossData = new BossData({ data: initialData });
      await bossData.save();
    }
    
    res.json({ data: bossData.data, updatedAt: bossData.updatedAt });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching boss data' });
  }
});

// Update boss data
app.post('/api/boss-data', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    // Delete old data and create new entry
    await BossData.deleteMany({});
    const newBossData = new BossData({ data });
    await newBossData.save();
    
    res.json({ 
      message: 'Boss data updated successfully',
      updatedAt: newBossData.updatedAt 
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Error updating boss data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
