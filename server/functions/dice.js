const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
  try {
    const { betAmount, selectedNumber } = req.body;
    
    if (!betAmount || !selectedNumber) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const isWin = diceRoll === parseInt(selectedNumber);
    const payout = isWin ? betAmount * 5 : 0;

    res.json({
      success: true,
      roll: diceRoll,
      win: isWin,
      payout: payout
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the serverless function
module.exports.handler = serverless(app); 