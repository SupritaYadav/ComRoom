# PROMPTS.md

This file records the planning prompts and implementation checklist used while building the Track B real-time chat assignment. It is included so the project can be explained and maintained rather than treated as a black box.

## Project brief

Build a full-stack real-time chat application for Track B using React on the client and Node.js, Express and Socket.IO on the server. Implement the mandatory WebSocket MVP, session identity and typing events, then complete the advanced room separation and routing phase.

## Planning prompts

1. **Project setup**
   - Create a clean Vite + React frontend and an Express backend.
   - Keep frontend and backend in separate folders with independent package files.
   - Use environment variables for the client origin and server URL.

2. **Socket.IO server**
   - Attach Socket.IO to the same HTTP server as Express.
   - Configure Socket.IO CORS explicitly; do not assume Express CORS middleware controls WebSocket handshakes.
   - Log successful connections and disconnects.
   - Validate the display name, room and message payload on the server.

3. **Client connection**
   - Create one Socket.IO client module.
   - Connect after the user submits a display name.
   - Disconnect and remove listeners when the chat view is left.
   - Avoid registering duplicate listeners during React StrictMode development renders.

4. **Messaging**
   - Send messages only after the server validates them.
   - Use `socket.to(room).emit(...)` so the sender does not receive their own message through the server broadcast.
   - Render the sender identity with each message.
   - Keep a small local copy of messages for the current session.

5. **Typing indicator**
   - Listen for keyboard input in the message composer.
   - Emit a typing event only when the typing state changes.
   - Broadcast the state to other clients in the same room.
   - Clear the indicator when the user sends a message or leaves the room.

6. **Room routing**
   - Provide at least two rooms: General and Tech Support.
   - Leave the previous room before joining another room.
   - Route both messages and typing events to the selected room only.
   - Show the users currently connected to the selected room.

7. **Verification**
   - Test with two or more browser tabs.
   - Confirm sender-excluded delivery.
   - Confirm that messages and typing indicators do not leak across rooms.
   - Check connection cleanup, server restart behavior and invalid input handling.

## Implementation decisions

- **Socket.IO instead of raw WebSocket:** it provides reconnection and event-based communication while still using a persistent bidirectional connection.
- **Server-side room membership:** clients cannot choose recipients; the server routes events based on the socket's joined room.
- **Sender-excluded message delivery:** `socket.to(room).emit` broadcasts to all sockets in the room except the sender.
- **In-memory state:** sufficient for demonstrating the assignment. It is intentionally not presented as durable storage.
- **No authentication:** the assignment asks for a unique session identity, so this implementation uses a display name. A real deployment should use authenticated user IDs.

## Manual test checklist

- [ ] Server starts on port 5000.
- [ ] Client starts on port 5173.
- [ ] User must provide a display name before joining.
- [ ] A message appears for other members in the same room.
- [ ] Sender does not receive a duplicate server echo.
- [ ] Message label includes the sender name.
- [ ] Typing indicator appears for other members in the same room.
- [ ] General and Tech Support are isolated.
- [ ] User list updates on join and disconnect.
- [ ] Socket listeners are removed during cleanup.
- [ ] Invalid message payloads are rejected.
