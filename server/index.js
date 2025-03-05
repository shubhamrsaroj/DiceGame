const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dice-game-client.vercel.app'] 
    : ['http://localhost:3000']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Dice roll endpoint
app.post('/api/roll-dice', (req, res) => {
  try {
    const { clientSeed, nonce, betAmount, target } = req.body;

    if (!clientSeed || !nonce || !betAmount || target === undefined) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Generate a random number between 0 and 100
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const combinedSeed = `${clientSeed}-${nonce}-${serverSeed}`;
    const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    
    // Use first 4 bytes of hash to generate number between 0 and 100
    const roll = (parseInt(hash.slice(0, 8), 16) % 10000) / 100;
    
    // Determine if player won
    const won = roll >= target;
    
    // Calculate payout (2x for winning)
    const payout = won ? betAmount * 2 : 0;

    res.json({
      roll,
      won,
      payout,
      serverSeed
    });
  } catch (error) {
    console.error('Error processing roll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For Vercel, we export the app
module.exports = app;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 