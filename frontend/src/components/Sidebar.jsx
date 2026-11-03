const rooms = [
  { name: 'General', detail: 'Everyday conversation', icon: '◌' },
  { name: 'Tech Support', detail: 'Questions & troubleshooting', icon: '⌘' }
];

export default function Sidebar({ room, onRoomChange, users, username }) {
  return (
    <aside className="sidebar">
      <div className="brand-row"><div className="brand-mark small">r</div><span>relay<span className="brand-dot">.</span></span></div>
      <p className="side-label">WORKSPACE</p>
      <div className="room-list">
        {rooms.map((item) => (
          <button key={item.name} className={`room-button ${room === item.name ? 'selected' : ''}`}
            onClick={() => onRoomChange(item.name)}>
            <span className="room-icon">{item.icon}</span>
            <span className="room-copy"><strong>{item.name}</strong><small>{item.detail}</small></span>
            {room === item.name && <span className="selected-dot" />}
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <p className="side-label">IN THIS CHANNEL <span>{users.length}</span></p>
        <div className="user-list">
          {users.map((user, index) => (
            <div className="user-row" key={user.id}>
              <span className={`avatar avatar-${index % 4}`}>{user.username.slice(0, 1).toUpperCase()}</span>
              <span>{user.username}{user.username === username ? ' (you)' : ''}</span>
              <i />
            </div>
          ))}
          {!users.length && <p className="muted tiny">Waiting for people to join…</p>}
        </div>
        <div className="profile-row">
          <span className="avatar avatar-me">{username.slice(0, 1).toUpperCase()}</span>
          <div><strong>{username}</strong><small>Connected member</small></div>
          <span className="online-dot" />
        </div>
      </div>
    </aside>
  );
}
