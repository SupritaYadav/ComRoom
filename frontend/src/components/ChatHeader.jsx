export default function ChatHeader({ room, connected }) {
  return (
    <header className="chat-header">
      <div>
        <div className="breadcrumb">Channels <span>/</span> <strong>{room}</strong></div>
        <h2>{room}</h2>
        <p>{room === 'General' ? 'A place for the team to catch up.' : 'Get help and work through technical questions.'}</p>
      </div>
      <div className={`connection-pill ${connected ? 'is-online' : ''}`}>
        <span />{connected ? 'Live connection' : 'Reconnecting'}
      </div>
    </header>
  );
}
