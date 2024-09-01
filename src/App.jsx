import { useContext, useEffect, useState } from 'react';
import Home from './pages/Home';
import './App.css';
import PreLoader from './components/PreLoader';
import { MusicContext } from './context/MusicContext';

function App() {
  const { songs: data, currentSong, error, loading } = useContext(MusicContext);
  const [background, setBackground] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (currentSong?.accent) {
      setBackground(`linear-gradient(108deg, ${currentSong.accent}, rgba(0, 0, 0, 0.60) 99.84%), #000`);
    }
    else{
      setBackground(`linear-gradient(120deg,#201606,#000)`);
    }
  }, [currentSong]);

  useEffect(() => {
    let timer;
    const startTime = Date.now();

    const checkLoadingStatus = () => {
      const elapsedTime = Date.now() - startTime;
      if (!loading && elapsedTime >= 4000) {
        setShowContent(true);
      } else if (elapsedTime >= 4000) {
        setShowContent(true);
      } else {
        timer = setTimeout(checkLoadingStatus, 100);
      }
    };

    checkLoadingStatus();

    return () => clearTimeout(timer);
  }, [loading]);

  if (!showContent) {
    return <div className=""><PreLoader /></div>;
  }

  if (error) {
    return (
      <div className="text-3xl text-white flex h-screen w-screen items-center justify-center">
        {error.message}
      </div>
    );
  }

  return (
    <div
      className='h-screen w-screen px-10 overflow-hidden background-container'
      style={{
        background,
        transition: 'background 1s ease-in-out'
      }}
    >
      {data && <Home />}
    </div>
  );
}

export default App;