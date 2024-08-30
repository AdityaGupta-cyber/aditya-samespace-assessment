
import  { useContext, useEffect, useState } from 'react'
import { MusicContext } from '../context/MusicContext'


function ListItems({icon,artist,name,key,setSelectedSong,isSelected,data}) {
    const {setIsPlaying,setOpen} = useContext(MusicContext)
    const [duration,setDuration] = useState()
    // setIsPlaying(true)
    
    useEffect(()=>{
      function getAudioDuration(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = url;


            audio.onerror = () => {
                reject(new Error('Failed to load audio'));
            };


            audio.onloadedmetadata = () => {
                resolve(audio.duration);
            };
        });
    }

    function formatDurationInMinutes(durationInSeconds) {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        return `${minutes}:${seconds}`;
    }


    const audioUrl = data?.url; 

    getAudioDuration(audioUrl)
        .then(duration => {
            const durationInMinutes = formatDurationInMinutes(duration);
            setDuration(durationInMinutes)
            console.log(`Audio duration is ${durationInMinutes}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    },[])

    const handleClick = () => {
        setOpen(false)
      setSelectedSong();   
      setIsPlaying(true);   
  };
  return (
    <div className={`flex   w-full h-20  p-2 items-center gap-3  rounded-md  cursor-pointer hover:bg-[#FFFFFF14] ${isSelected ? 'bg-[#FFFFFF14]':'bg-inherit'}`}  
     key={key}
     onClick={handleClick}
     >
        <div className="flex items-center text-nowrap overflow-hidden ">
            <img src={`https://cms.samespace.com/assets/${icon}`}  className='h-14 w-20 object-cover  object-center rounded-full' alt="" />
        </div>
        <div className="w-full flex flex-col">
            <h1 className='text-xl'>{name}</h1>
            <span className='text-sm text-zinc-400'>{artist}</span>
        </div>
        <div className="flex w-1/6 items-center h-full">
            <h4 className='text-zinc-400  font-medium'>{duration}</h4>
        </div>
    </div>
  )
}

export default ListItems