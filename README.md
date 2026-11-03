# Real-Time Chat — Track B

A small full-stack chat application built with React, Vite, Express and Socket.IO. It demonstrates persistent WebSocket connections, session identity, room-based messaging and live typing indicators.

## Features

- React client connects to an Express/Socket.IO server.
- Users enter a display name before joining.
- Two isolated channels: **General** and **Tech Support**.
- Messages are sent to everyone else in the selected room (the sender is not echoed back).
- New messages show the sender's session identity, e.g. `[Nakul]: Hello!`.
- Typing events are broadcast to other members of the same room.
- Active users in the selected room are listed in the sidebar.
- Connection state and server errors are visible in the UI.
- Socket listeners and the connection are cleaned up on unmount.
- Socket.IO CORS is configured separately from Express HTTP CORS.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Project structure

```text
realtime-chat-socketio/
├── backend/
│   ├── src/
│   │   ├── config.js
│   │   ├── socket.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── UserPrompt.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── socket.js
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── .gitignore
└── PROMPTS.md
```

## Run locally

Open two terminals from the project root.

### 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The API and Socket.IO server run at `http://localhost:5000` by default.

### 2. Start the React client

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env`.

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Open it in another browser tab or an incognito window to test multiple users.

## How to test the requirements

1. Open the app in two browser tabs and join with different names.
2. Select **General** in both tabs. Send a message from one tab. It should appear in the other tab, not be echoed to the sender.
3. Switch one user to **Tech Support**. Messages sent in General should not appear there.
4. Start typing in one tab. The other member of the same room should see the typing indicator.
5. Refresh a tab. The socket reconnects and the user is registered again after joining.
6. Stop the backend to check that the client shows a disconnected state.

## Useful endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | API status and endpoint list |
| GET | `/health` | Server and Socket.IO health |
| GET | `/rooms` | Available chat rooms |

Socket.IO events:

| Direction | Event | Payload |
|---|---|---|
| Client → Server | `join_room` | `{ username, room }` |
| Client → Server | `chat_message` | `{ text }` |
| Client → Server | `typing` | `{ isTyping }` |
| Server → Client | `room_message` | `{ id, username, text, room, createdAt }` |
| Server → Client | `room_users` | `{ room, users }` |
| Server → Client | `user_typing` | `{ username, isTyping }` |
| Server → Client | `chat_error` | `{ message }` |

## Notes

- The app intentionally keeps chat history in memory. Restarting the backend clears messages and connected users.
- Socket.IO handles reconnect attempts automatically. The app asks the user to rejoin after a connection is restored.
- This is a learning project, not a production chat service. Production deployment should add authentication, rate limiting, persistent storage, input moderation and HTTPS.
