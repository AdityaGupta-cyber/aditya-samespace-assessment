import React, { useContext, useEffect, useRef, useState } from 'react';
import { MusicContext } from '../context/MusicContext';
import Next from '../assets/Vector.svg';
import Prev from '../assets/Vector2.png';
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
                        />

                        {/* Music Controls */}
                        <div className="flex flex-col h-40 w-full mt-3 lg:items-start md:items-center sm:items-start music-controls-container">
                            <audio
                                ref={audioRef}
                                src={currentSong.url}
                                className='hidden'
                            />
                            <div className="progress-container lg:w-[480px] md:w-[80%] flex">
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

                            <div className="flex justify-between lg:w-[480px] md:w-[80%] mt-5 items-center">
                                <div className="flex items-center w-fit p-2 bg-[#FFFFFF1A] rounded-full">
                                    <MoreHorizIcon />
                                </div>
                                <div className="flex gap-5 items-center">
                                    <button onClick={handlePrevTrack}>
                                        <img src={Prev} className='text-white' alt="Previous"/>
                                    </button>
                                    <button onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <PauseCircleIcon style={{ fontSize: '3rem' }} /> : <PlayCircleIcon style={{ fontSize: '3rem' }}/>}
                                    </button>
                                    <button onClick={handleNextTrack}>
                                        <img src={Next} alt="Next"/>
                                    </button>
                                </div>

                                <div className="volume-container flex gap-2 items-center relative">
                                    <div className="volume flex items-center w-fit p-2 bg-[#FFFFFF1A] rounded-full volume-chooser" onClick={() => setShowVolume(!showVolume)}>
                                        {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                    </div>
                                    <input
                                        type="range"
                                        id="volume"
                                        value={volume}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        className={`${showVolume ? 'flex' : 'hidden'} slider absolute top-[20%] -right-[90%] -rotate-90 w-[100vh]`}
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
