import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import DeckPage from './pages/DeckPage.jsx';
import StudyFlashcards from './pages/StudyFlashcards.jsx';
import StudyLearn from './pages/StudyLearn.jsx';
import StudyTest from './pages/StudyTest.jsx';
import EditDeck from './pages/EditDeck.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
          <Route path="/deck/:deckId/flashcards" element={<StudyFlashcards />} />
          <Route path="/deck/:deckId/learn" element={<StudyLearn />} />
          <Route path="/deck/:deckId/test" element={<StudyTest />} />
          <Route path="/deck/:deckId/edit" element={<EditDeck />} />
        </Routes>
      </div>
    </>
  );
}
