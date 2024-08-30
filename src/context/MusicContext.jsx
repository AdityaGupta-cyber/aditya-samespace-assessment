import  {createContext,useState,useEffect} from 'react'
import axios from 'axios'

export const MusicContext = createContext()

export const MusicProvider = ({children}) =>{
    const [songs,setSongs] = useState([]);
    const [currentSong,setCurrentSong] = useState(null);
    const [isPlaying,setIsPlaying] = useState(false)
    const [filteredData,setFilteredData] = useState()
    const[searchValue,setSearchValue] = useState('')
    const [open,setOpen] = useState(true)
    const[error,setError] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cms.samespace.com/items/songs');
                setSongs(response.data.data);
                setFilteredData(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return(
        <MusicContext.Provider value={{songs,currentSong,setCurrentSong,isPlaying,setIsPlaying,setFilteredData,filteredData,searchValue,setSearchValue,open,setOpen,loading,error}}>
            {children}
        </MusicContext.Provider>
    )   

}