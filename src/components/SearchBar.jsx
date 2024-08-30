
import { useContext} from 'react'
import Frame from '../assets/Frame.svg'
import { MusicContext } from '../context/MusicContext'


function SearchBar() {

  const {setSearchValue} = useContext(MusicContext)

  const handleSearch = (value) =>{
    setSearchValue(value.toLowerCase());
  }
  return (
    <div className=" w-full flex items-center h-fit rounded-md bg-[rgba(255,255,255,0.08)] py-2 px-4">
        <input className='flex w-full bg-transparent text-xl font-medium outline-none' onChange={(event)=> handleSearch(event.target.value)} placeholder='Search Song, Artist'/>
        <img src={Frame} alt="search" className='h-fit' loading='lazy'/>
    </div>
  )
}

export default SearchBar