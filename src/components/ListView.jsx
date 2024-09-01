import { useContext, useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import ListItems from './ListItems';
import { MusicContext } from '../context/MusicContext';
import { motion } from 'framer-motion';

// Utility function to check if the screen is large
const isLgScreen = () => window.matchMedia('(min-width: 1024px)').matches;

function ListView() {
  const { songs: data, setCurrentSong, currentSong, setFilteredData, filteredData, searchValue, open } = useContext(MusicContext);
  const [active, setActive] = useState('For_You');
  const [animate, setAnimate] = useState(false);
  const [showList, setShowList] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(isLgScreen());


  useEffect(() => {
    if (active === 'For_You') {
      setFilteredData(data);
    } else if (active === 'Top_Tracks') {
      const filtered = data?.filter((item) => item.top_track === true);
      setFilteredData(filtered);
    }
  }, [active, data, setFilteredData]);

  // // Handle screen size changes
  // useEffect(() => {
  //   const handleResize = () => setIsLargeScreen(isLgScreen());
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // Handle tab change and animation
  useEffect(() => {
  
      setAnimate(true);
      setShowList(false); 

   
      const timer = setTimeout(() => {
        setShowList(true);
        setAnimate(false); 
      }, 500); 

      return () => clearTimeout(timer); 
    
  }, [active, isLargeScreen]);

  function handleClick(item) {
    setCurrentSong(item);
  }

  return (
    <motion.div
      initial={{ translateX: '-40%' }}
      animate={{ translateX: isLargeScreen ? 0 : (open ? 0 : '-40%') }}
      transition={{ duration: 1 }}
      className={`lg:flex flex-col lg:w-1/3 w-full lg:mt-7 sm:mb-3 min-h-full md:min-h-screen sm:h-full lg:static ${open ? 'flex' : 'hidden h-0'}`}
    >
      <div className="flex gap-10 text-2xl font-bold items-center">
        <h1
          onClick={() => setActive('For_You')}
          className={`${active === 'For_You' ? 'opacity-1' : 'opacity-[0.4]'} cursor-pointer`}
        >
          For You
        </h1>
        <h1
          onClick={() => setActive('Top_Tracks')}
          className={`${active === 'Top_Tracks' ? 'opacity-1' : 'opacity-[0.4]'} cursor-pointer`}
        >
          Top Tracks
        </h1>
      </div>
      <div className="my-5 flex w-full">
        <SearchBar />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 0 : 1 }}
        transition={{ duration: 1 }}
        className={`mb-44 lg:mb-2 overflow-y-scroll no-scrollbar ${showList ? '' : 'hidden'}`}
      >
        {filteredData
          ?.filter((data) => data.name.toLowerCase().includes(searchValue) || data.artist.toLowerCase().includes(searchValue))
          ?.map((item, index) => (
            <ListItems
              icon={item.cover}
              artist={item.artist}
              name={item.name}
              data={item}
              key={index}
              isSelected={currentSong?.id === item?.id}
              setSelectedSong={() => handleClick(item)}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}

export default ListView;
