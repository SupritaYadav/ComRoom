# PROMPTS.md

This file records the prompts and implementation checklist used while building the  real-time chat assignment.


1. Understanding the concepts
## Prompt 1 --- HTTP requests vs WebSockets
I understand the normal request-response flow in HTTP, but how is a
WebSocket connection different? Explain it with a simple example from
a chat application. Also explain why repeatedly polling the server is
not ideal for a live chat.

## Prompt 2 --- Why Socket.IO?
What does Socket.IO provide on top of WebSockets? Is Socket.IO the
same thing as the WebSocket protocol, or is it a library that uses it?
Explain the difference without going too deep into theory.

## Prompt 3 --- How rooms work
I need two separate chat channels, General and Tech Support. Explain
how Socket.IO rooms work and how the server can send a message only to
clients who joined one particular room.

## Prompt 4 --- Broadcasting and excluding the sender
What is the difference between io.emit() and
socket.broadcast.emit()? If I want every other user in the current
room to receive a message but I do not want the sender to receive a
duplicate, which method should I use and why?

## Prompt 5 --- Typing indicators
How are typing indicators normally implemented in a real-time chat?
Should the client send an event on every key press, or only when the
typing state changes? Show a small Socket.IO example.

## Prompt 6 --- CORS and Socket.IO
I have enabled CORS in my Express app. Does that automatically
configure CORS for Socket.IO too? Explain why the Socket.IO server
needs its own CORS configuration and what the origin and methods
options mean.

2. Planning and project structure
## Prompt 7 --- Splitting frontend and backend
I am making a React + Express chat application with Socket.IO. Suggest
a simple folder structure that keeps the frontend and backend
separate. I want it to be easy to understand and suitable for a
college-level full-stack project.

## Prompt 8 --- Attaching Socket.IO to Express
Explain how to create an HTTP server from an Express app and attach a
Socket.IO server to it. Why should Socket.IO use the HTTP server
instead of calling app.listen() separately?

## Prompt 9 --- Environment variables
I want to run the frontend and backend locally and deploy them
separately later. Explain which URLs should be stored in environment
variables and how Vite reads variables prefixed with VITE_.

3. Implementation support
## Prompt 10 --- Basic socket connection
Help me set up a Socket.IO connection from a React application to my
Express backend. Keep the client connection in a separate file so I
can reuse it. Explain what autoConnect: false does and when I should
call connect().

## Prompt 11 --- Joining with a display name
Before a user enters the chat, I want to ask for a display name. How
can the client send the name and selected room to the server using a
join_room event? What should the server validate before allowing the
socket to join?

## Prompt 12 --- Sending and receiving messages
Show me a simple message flow for this chat: the user types a message
in React, the client emits a chat_message event, and the server
sends it to the other members of that room. Please explain the payload
at each step.

## Prompt 13 --- Showing the sender's identity
I want incoming messages to show the sender's name, for example
[Nakul]: Hello. What information should the server include in the
message object so the React UI can display the sender, message text
and time?

## Prompt 14 --- Managing the room member list
How can I keep track of connected users in each Socket.IO room? I want
the member list in the sidebar to update when someone joins or
disconnects. Explain a simple in-memory approach and its limitations.

## Prompt 15 --- Switching rooms
When a user changes from General to Tech Support, how do I make the
socket leave the old room before joining the new one? I also want
messages and typing events to stay limited to the selected room.

4. React behaviour and debugging
## Prompt 16 --- React StrictMode and duplicate events
My React app uses React.StrictMode. During development, effects can
run more than once. How can this cause duplicate Socket.IO listeners
or connections? Explain how to register listeners and remove the exact
same handlers in the effect cleanup.

## Prompt 17 --- Cleaning up a socket connection
What is the correct way to clean up Socket.IO event listeners in a
React useEffect? Explain the difference between socket.off() and
socket.disconnect() and when each one is needed.

## Prompt 18 --- Why the sender needs a local message
If the server uses socket.to(room).emit() to exclude the sender, the
sender will not receive the server's message event. How should the
React client show its own message immediately without creating a
duplicate?

## Prompt 19 --- Messages disappearing after switching channels
In my current React code, I clear the messages array when the user
changes rooms. This makes the previous room's messages disappear when
I return to it. Explain why this happens and suggest a simple way to
keep separate message lists for General and Tech Support on the
client. Also explain what would be needed to keep history after a
server restart.

## Prompt 20 --- Duplicate usernames in the sidebar
I opened the chat in multiple tabs using the same display name, and
the sidebar showed the name more than once. Is this expected if each
tab has a different socket connection? What are the options for
displaying unique names while still tracking each socket separately?

5. Testing and deployment
## Prompt 21 --- Testing with two browser tabs
How can I test a Socket.IO chat application locally using two browser
tabs? Give me a manual checklist to verify message delivery, sender
exclusion, typing indicators, room separation and disconnect
behaviour.

## Prompt 22 --- Testing room isolation
I want to confirm that General and Tech Support are isolated. Describe
a test where one browser is in General and another is in Tech Support,
and explain what result should prove that room routing is working.

## Prompt 23 --- Deploying a Vite frontend and Socket.IO backend
My project has a Vite frontend and an Express + Socket.IO backend in
separate folders. Can I deploy the frontend on Vercel and the backend
as a Render Web Service? Explain why they need separate deployment
settings.

## Prompt 24 --- Production environment variables
After deploying the backend, what should I put in the Vercel
VITE_SOCKET_URL variable? What should the backend's CLIENT_URL
contain? Explain why I need to redeploy the frontend after changing a
Vite environment variable.

## Prompt 25 --- Checking a deployed backend
My Render service says that deployment succeeded. How can I check
whether the Express API is responding and whether the server is
running? Suggest simple browser checks using the root route and a
health endpoint.

## Prompt 26 --- Debugging a connection problem
The frontend is deployed but the Socket.IO connection is not working.
Give me a sensible debugging order: check the backend URL, environment
variables, CORS configuration, Render logs and browser console.
Explain what each check can tell me.