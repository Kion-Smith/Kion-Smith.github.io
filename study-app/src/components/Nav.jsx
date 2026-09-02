import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="top-nav">
      <Link to="/" className="brand">📚 Study Cards</Link>
      {!isHome ? (
        <Link to="/" className="back">
          ← All decks
        </Link>
      ) : (
        <a className="back" href="/">
          ← Back to site
        </a>
      )}
    </div>
  );
}
