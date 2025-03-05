const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
  try {
    const { betAmount, selectedNumber, clientSeed, nonce } = req.body;
    
    if (!betAmount || selectedNumber === undefined) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        received: { betAmount, selectedNumber, clientSeed, nonce }
      });
    }

    // Generate random number between 0 and 100
    const diceRoll = Math.random() * 100;
    
    // Compare with selected number
    const isWin = diceRoll > selectedNumber;
    
    // Calculate payout based on probability
    const multiplier = 100 / selectedNumber;
    const payout = isWin ? Math.floor(betAmount * multiplier) : 0;

    res.json({
      success: true,
      roll: diceRoll,
      win: isWin,
      payout: payout,
      multiplier: multiplier,
      clientSeed,
      nonce
    });
  } catch (error) {
    console.error('Error in dice function:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app); 