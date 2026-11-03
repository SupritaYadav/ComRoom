import { useState } from 'react';

export default function UserPrompt({ onJoin }) {
  const [username, setUsername] = useState('');

  function submit(event) {
    event.preventDefault();
    const cleanName = username.trim();
    if (cleanName) onJoin(cleanName);
  }

  return (
    <main className="entry-screen">
      <form className="entry-card" onSubmit={submit}>
        <div className="brand-mark">r</div>
        <p className="eyebrow">A small space to talk</p>
        <h1>Join the conversation.</h1>
        <p className="muted">Choose a name to enter the live chat. You can switch channels whenever you need.</p>
        <label htmlFor="username">Your display name</label>
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. Nakul" maxLength={24} autoFocus required />
        <button className="primary-button" type="submit">Continue <span>→</span></button>
        <small>Messages are live and are not saved after the server restarts.</small>
      </form>
    </main>
  );
}
