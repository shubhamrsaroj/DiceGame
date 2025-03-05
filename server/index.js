const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Store server seed (in a real application, this should be stored in a database)
let serverSeed = crypto.randomBytes(32).toString('hex');

// Store recent results (in a real application, this should be stored in a database)
let recentResults = [];

// Store game statistics
let gameStats = {
    totalBets: 0,
    totalWins: 0,
    totalLosses: 0,
    highestWin: 0,
    lowestRoll: 100,
    highestRoll: 0
};

// Simple rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

function rateLimit(ip) {
    const now = Date.now();
    const userRequests = requestCounts.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
        return false;
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    return true;
}

// Generate hash for client to verify
function generateHash(serverSeed, clientSeed, nonce) {
    return crypto.createHash('sha256')
        .update(serverSeed + clientSeed + nonce.toString())
        .digest('hex');
}

// Generate roll number (0-100) from hash
function getRollFromHash(hash) {
    const decimal = parseInt(hash.slice(0, 8), 16);
    // Generate a number between 0 and 100 with 2 decimal places
    return Number((decimal % 10001) / 100).toFixed(2);
}

// Calculate if roll is a win based on target
function isWin(roll, target) {
    return parseFloat(roll) >= target;
}

// Update game statistics
function updateGameStats(roll, won, payout) {
    gameStats.totalBets++;
    if (won) {
        gameStats.totalWins++;
        if (payout > gameStats.highestWin) {
            gameStats.highestWin = payout;
        }
    } else {
        gameStats.totalLosses++;
    }

    const rollValue = parseFloat(roll);
    if (rollValue < gameStats.lowestRoll) {
        gameStats.lowestRoll = rollValue;
    }
    if (rollValue > gameStats.highestRoll) {
        gameStats.highestRoll = rollValue;
    }
}

app.post('/api/roll-dice', (req, res) => {
    // Rate limiting
    const clientIp = req.ip;
    if (!rateLimit(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { clientSeed, nonce, betAmount, target = 50.50 } = req.body;
    
    // Validate required parameters
    if (!clientSeed || nonce === undefined || !betAmount) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate bet amount
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount' });
    }

    // Generate roll hash
    const hash = generateHash(serverSeed, clientSeed, nonce);
    const roll = getRollFromHash(hash);
    
    // Determine if player won
    const won = isWin(roll, target);
    const multiplier = 2.0000;
    const payout = won ? bet * multiplier : 0;

    // Update game statistics
    updateGameStats(roll, won, payout);

    // Store current server seed for verification
    const currentServerSeed = serverSeed;
    
    // Generate new server seed for next round
    serverSeed = crypto.randomBytes(32).toString('hex');

    // Add result to recent results
    recentResults.unshift({
        roll: parseFloat(roll),
        won,
        payout,
        timestamp: Date.now()
    });
    if (recentResults.length > 10) {
        recentResults.pop();
    }

    res.json({
        roll,
        won,
        payout,
        hash,
        serverSeed: currentServerSeed,
        nextServerSeed: serverSeed,
        target,
        multiplier,
        winChance: 49.5000,
        gameStats
    });
});

// Endpoint to get new server seed
app.get('/api/server-seed', (req, res) => {
    serverSeed = crypto.randomBytes(32).toString('hex');
    res.json({ serverSeed });
});

// Endpoint to get recent results
app.get('/api/recent-results', (req, res) => {
    res.json({ 
        results: recentResults,
        gameStats 
    });
});

// Endpoint to get game statistics
app.get('/api/stats', (req, res) => {
    res.json({ gameStats });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 