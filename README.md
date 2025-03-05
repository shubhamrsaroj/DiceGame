 # Dice Game

A modern, interactive dice game built with React and Node.js. Players can bet on dice rolls with a sleek, animated interface and real-time results.

## Features

- Interactive slider-based betting interface
- Smooth animations and visual effects
- Real-time sound effects
- Auto-betting functionality
- Budget management system
- Win/loss tracking
- Responsive design

## Project Structure

```
bc-dice-game/
├── client/              # React frontend
│   ├── public/
│   │   └── sounds/     # Game sound effects
│   └── src/            # Source files
│       ├── components/
│       └── App.js
└── server/             # Node.js backend
    ├── routes/
    └── server.js
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shubhamrsaroj/DiceGame.git
   cd DiceGame
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Create a `.env` file in the server directory with your configuration:
   ```
   PORT=5000
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Frontend:
  - React
  - Styled Components
  - Axios

- Backend:
  - Node.js
  - Express
  - Crypto (for random number generation)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Shubham Saroj - [@shubhamrsaroj](https://github.com/shubhamrsaroj)