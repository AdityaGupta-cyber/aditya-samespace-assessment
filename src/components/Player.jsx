import React, { useContext, useEffect, useRef, useState } from 'react';
import { MusicContext } from '../context/MusicContext';
import Next from '../assets/vector6.svg';
import Prev from '../assets/vector5.svg';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { motion } from 'framer-motion';

function Player() {
    const { currentSong, setCurrentSong, isPlaying, setIsPlaying, filteredData, open } = useContext(MusicContext);
    
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const [showVolume, setShowVolume] = useState(false);

    const handleProgressChange = (event) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = (event.target.value / 100) * audio.duration;
        }
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    const handlePrevTrack = () => {
        setCurrentSong((prevTrack) => {
            if (!prevTrack || !filteredData.length) return prevTrack;
    
            const currentIndex = filteredData.findIndex(song => song.id === prevTrack.id);
            if (currentIndex === -1) return prevTrack;

            const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredData.length - 1;
            return filteredData[prevIndex];
        });

        setIsPlaying(true);
    };

    const handleNextTrack = () => {
        const currentIndex = filteredData.findIndex(song => song.id === currentSong.id);
    
        if (currentIndex === -1) {
            setCurrentSong(filteredData[0]);
            return;
        }

        const nextIndex = (currentIndex + 1) % filteredData.length;
    
        setCurrentSong(filteredData[nextIndex]);
        setIsPlaying(true);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handleEnded = () => {
            handleNextTrack();
        };

        if (audio) {
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('ended', handleEnded);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('ended', handleEnded);
            }
        };
    }, [currentSong]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Pause the audio when the page is hidden
                if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
            } else {
                // Resume the audio only if it was previously playing
                if (audioRef.current && isPlaying) {
                    audioRef.current.play();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPlaying]);

    const playerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 50 } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
    };

    return (
        <>
            {currentSong && Object.keys(currentSong).length > 0 && (
                <motion.div
                    key={currentSong.id}
                    initial="hidden"    
                    animate="visible"
                    exit="exit"
                    variants={playerVariants}
                    className={`player-container flex flex-col lg:items-start md:items-center sm:items-start lg:p-10 lg:pl-10 lg:w-2/4 w-full ${
                        open ? "hidden md:flex" : "flex"
                    } lg:mt-7 mt-3`}
                >
                    <div className="flex">
                        <h1 className='text-4xl font-bold'>{currentSong.name}</h1>
                    </div>
                    <div className="flex mt-3 ml-2">
                        <span className='text-zinc-400'>{currentSong.artist}</span>
                    </div>
                    <div className="flex flex-col h-3/4 lg:items-start md:items-center sm:items-start w-full">
                        <img
                            src={`https://cms.samespace.com/assets/${currentSong.cover}`}
                            className='lg:max-h-[480px] lg:min-h-[480px] max-h-[50vh] min-h-[50vh] lg:w-[480px] md:w-[80%] mt-5 rounded-lg object-cover'
                            alt={`Cover art for ${currentSong.name}`}
                            loading='lazy'
                        />

                        {/* Music Controls */}
                        <div className="flex flex-col h-40 lg:w-[480px] md:w-[80%] w-full mt-3 music-controls-container">
                            <audio
                                ref={audioRef}
                                src={currentSong.url}
                                className='hidden'
                            />
                            <div className="progress-container w-full flex">
                                <input
                                    type="range"
                                    value={progress}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className='w-full'
                                    onChange={handleProgressChange}
                                />
                            </div>

                            <div className="flex justify-between w-full mt-5 items-center">
                                <div className="flex items-center p-2 bg-[#FFFFFF1A] rounded-full">
                                    <MoreHorizIcon className="text-white" />
                                </div>
                                <div className="flex gap-2 sm:gap-5 items-center">
                                    <button onClick={handlePrevTrack} className="p-2">
                                        <img src={Prev} className="w-10 h-10 sm:w-6 sm:h-6" alt="Previous" />
                                    </button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2">
                                        {isPlaying ? 
                                            <PauseCircleIcon style={{ fontSize: '3rem' }} className="text-white" /> : 
                                            <PlayCircleIcon style={{ fontSize: '3rem' }} className="text-white" />
                                        }
                                    </button>
                                    <button onClick={handleNextTrack} className="p-2">
                                        <img src={Next} className="w-10 h-10 sm:w-6 sm:h-6" alt="Next" />
                                    </button>
                                </div>

                                <div className="volume-container flex items-center relative">
                                    <div 
                                        className="volume flex items-center p-2 bg-[#FFFFFF1A] rounded-full volume-chooser"
                                        onClick={() => setShowVolume(!showVolume)}
                                    >
                                        {volume == 0 ? 
                                            <VolumeOffIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" /> : 
                                            <VolumeUpIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                                        }
                                    </div>
                                    <input
                                        type="range"
                                        id="volume"
                                        value={volume}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        className={`${showVolume ? 'block' : 'hidden'} slider absolute bottom-full -right-4 w-20 -rotate-90 origin-bottom-right`}
                                        onChange={handleVolumeChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default Player;
