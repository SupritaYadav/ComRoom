import { useCallback, useEffect, useRef, useState } from 'react';
import { createChatSocket } from './socket';
import UserPrompt from './components/UserPrompt';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';

const initialRoom = 'General';

export default function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(initialRoom);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [draft, setDraft] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const typingRef = useRef(false);
  const roomRef = useRef(room);
  roomRef.current = room;

  const joinRoom = useCallback((nextRoom) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    setRoom(nextRoom);
    setMessages([]);
    setTypingUsers([]);
  }, [username]);

  useEffect(() => {
    if (!username) return undefined;

    const socket = createChatSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      setError('');
      socket.emit('join_room', { username, room });
    };
    const onDisconnect = () => {
      setConnected(false);
      setUsers([]);
      setTypingUsers([]);
    };
    const onMessage = (message) => {
      setMessages((current) => [...current, message]);
    };
    const onUsers = (payload) => {
      if (payload.room === roomRef.current) setUsers(payload.users);
    };
    const onTyping = ({ username: who, isTyping }) => {
      if (!who || who === username) return;
      setTypingUsers((current) => isTyping
        ? (current.includes(who) ? current : [...current, who])
        : current.filter((name) => name !== who));
    };
    const onError = (payload) => setError(payload?.message || 'Something went wrong.');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_message', onMessage);
    socket.on('room_users', onUsers);
    socket.on('user_typing', onTyping);
    socket.on('chat_error', onError);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_message', onMessage);
      socket.off('room_users', onUsers);
      socket.off('user_typing', onTyping);
      socket.off('chat_error', onError);
      socket.disconnect();
      socketRef.current = null;
    };
  // A new socket is created for each joined identity; room changes are emitted separately.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // Re-register the room listener with the current room, without reconnecting the socket.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !username) return;
    socket.emit('join_room', { username, room });
    setTypingUsers([]);
  }, [room, username]);

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !socketRef.current?.connected) return;

    const localMessage = {
      id: `local-${Date.now()}`,
      username,
      text,
      room,
      createdAt: new Date().toISOString(),
      local: true
    };
    // The server excludes the sender, so add the sender's own message locally.
    setMessages((current) => [...current, localMessage]);
    socketRef.current.emit('chat_message', { text });
    setDraft('');
    if (typingRef.current) {
      socketRef.current.emit('typing', { isTyping: false });
      typingRef.current = false;
    }
  }

  function updateDraft(value) {
    setDraft(value);
    const isTyping = Boolean(value.trim());
    if (isTyping !== typingRef.current && socketRef.current?.connected) {
      typingRef.current = isTyping;
      socketRef.current.emit('typing', { isTyping });
    }
  }

  if (!username) return <UserPrompt onJoin={setUsername} />;

  return (
    <main className="app-shell">
      <Sidebar room={room} onRoomChange={joinRoom} users={users} username={username} />
      <section className="chat-panel">
        <ChatHeader room={room} connected={connected} />
        {error && <div className="error-banner">{error}</div>}
        <MessageList messages={messages} username={username} typingUsers={typingUsers} />
        <form className="composer-wrap" onSubmit={sendMessage}>
          <div className="composer">
            <input value={draft} onChange={(e) => updateDraft(e.target.value)}
              placeholder={connected ? `Message #${room.toLowerCase().replaceAll(' ', '-')}` : 'Waiting for connection…'}
              disabled={!connected} maxLength={1000} />
            <span className="composer-hint">Enter to send</span>
            <button type="submit" className="send-button" disabled={!connected || !draft.trim()} aria-label="Send message">↑</button>
          </div>
          <p className="composer-note">Keep it helpful and respectful. Messages are shared with this channel.</p>
        </form>
      </section>
    </main>
  );
}
