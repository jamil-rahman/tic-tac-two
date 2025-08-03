# 🎮 Tic-Tac-Two

A real-time multiplayer Tic-Tac-Toe game built with Next.js 15, TypeScript, and Socket.IO.

## Features

- Real-time multiplayer gameplay
- Room-based matchmaking with unique codes
- 2-second timer per move with CPU fallback
- Modern, responsive UI with Tailwind CSS
- Automatic win detection and game over handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tic-tac-two
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Server Configuration
HOSTNAME=localhost
PORT=3000
CLIENT_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOSTNAME` | Server hostname | `localhost` | No |
| `PORT` | Server port | `3000` | No |
| `CLIENT_URL` | Client URL for CORS | `http://localhost:3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `NEXT_PUBLIC_SERVER_URL` | Socket.IO server URL (client-side) | `http://localhost:3000` | No |

## How to Play

1. **Host a Game**: Click "Host Game" to create a new room
2. **Join a Game**: Click "Join Game" and enter the room code shared by the host
3. **Start Playing**: The host can start the game once both players are connected
4. **Take Turns**: Each player has 2 seconds to make a move, or the CPU will play automatically
5. **Win**: Get three in a row to win!

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Custom Node.js server with Socket.IO
- **Real-time**: Socket.IO for WebSocket communication
- **State Management**: React hooks with sessionStorage

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Deployment

This project can be deployed to Vercel, Netlify, or any Node.js hosting platform. Make sure to:

1. Set the appropriate environment variables for production
2. Configure the `CLIENT_URL` to match your domain
3. Ensure WebSocket connections are supported by your hosting provider

## License

MIT
