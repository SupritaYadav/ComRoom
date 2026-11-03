import { useEffect, useRef } from 'react';

function timeLabel(value) {
  return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function MessageList({ messages, username, typingUsers }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  return (
    <div className="message-area">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✳</div>
          <h3>It’s quiet in here.</h3>
          <p>Start the conversation. Your message will reach everyone else in this channel.</p>
        </div>
      ) : (
        <div className="messages">
          {messages.map((message) => {
            const mine = message.username === username && message.local;
            return (
              <article className={`message ${mine ? 'mine' : ''}`} key={message.id}>
                <div className="message-avatar">{message.username.slice(0, 1).toUpperCase()}</div>
                <div className="message-content">
                  <div className="message-meta"><strong>{message.username}</strong><time>{timeLabel(message.createdAt)}</time></div>
                  <p>{message.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {typingUsers.length > 0 && (
        <div className="typing-line"><span className="typing-dots"><i /><i /><i /></span>
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
