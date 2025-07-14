# MetLife PI Bot Interface

A custom React-based user interface for the MetLife PI Bot that provides both an emulator-style interface and a real bot client.

## Features

### 🤖 Bot Client
- **Real Bot Connection**: Connects to the actual PI Bot server running on port 3978
- **Connection Testing**: Test if the bot server is running before connecting
- **HTTP Communication**: Sends messages to the bot using HTTP requests
- **Real-time Chat**: Interactive chat interface with the bot

### 🎮 Bot Emulator
- **Mock Interface**: Simulates the Bot Framework Emulator experience
- **Offline Testing**: Test conversation flows without running the bot server
- **Mock Responses**: Provides simulated bot responses for development

## Quick Start

### 1. Start the Bot Server
Navigate to the pi-bot directory and start the server:
```bash
cd pi_req/src/pi-bot
npm install
npm start
```

The bot server will start on `http://localhost:3978`

### 2. Start the Web Interface
In the main project directory:
```bash
cd pi_req
npm install
npm run dev
```

The web interface will be available at `http://localhost:5173`

### 3. Use the Interface
1. **Bot Client Tab**: 
   - Click "Test Connection" to verify the bot server is running
   - Click "Connect" to establish connection with the bot
   - Start chatting with the real PI Bot

2. **Bot Emulator Tab**:
   - Click "Connect" for offline testing
   - Chat with mock responses for development/testing

## Customization
- Edit `src/App.tsx` to change the main component.
- Add new components in the `src` directory.

---

This project was bootstrapped with Vite's React + TypeScript template.
