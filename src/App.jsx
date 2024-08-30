import { useContext, useEffect, useState } from 'react';
import Home from './pages/Home';
import './App.css';
import PreLoader from './components/PreLoader';
import { MusicContext } from './context/MusicContext';

function App() {
  const { songs: data, currentSong, error, loading } = useContext(MusicContext);
  const [background, setBackground] = useState('');

  useEffect(() => {
    if (currentSong?.accent) {
      setBackground(`linear-gradient(108deg, ${currentSong.accent}, rgba(0, 0, 0, 0.60) 99.84%), #000`);
    }
  }, [currentSong]);

  if (loading) return <div className=""><PreLoader /></div>;
  if (error) return <div className="text-3xl text-white flex h-screen w-screen items-center justify-center"> {error.message}</div>;

  return (
    <div
      className='h-screen w-screen px-10 overflow-hidden background-container'
      style={{
        background,
        transition: 'background 1s ease-in-out' // Apply a transition for smooth background change
      }}
    >
      {data && <Home />}
    </div>
  );
}

export default App;
