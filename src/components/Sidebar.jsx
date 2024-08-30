import  { useContext } from 'react'
import logo from '../assets/Logo.svg'
import profile from '../assets/Profile.png';
import MenuIcon from '@mui/icons-material/Menu';
import { MusicContext } from '../context/MusicContext';
import { motion } from 'framer-motion';
function Sidebar() {
  const {open,setOpen} = useContext(MusicContext)
  return (
    <div className=" sidebar py-7  lg:w-1/4 w-full   flex lg:flex-col justify-between  lg:items-start items-center lg:mb-0 mb-2">
    <motion.div  initial={{opacity:0.3}} animate={{opacity:1}} transition={{ duration: 2, ease: [0.5, 1, 0.89, 1] }}>
        <img src={logo} alt="logo" className=''/>
    </motion.div>
    <motion.div initial={{opacity:0.3}} animate={{opacity:1}} transition={{ duration: 2, ease: [0.5, 1, 0.89, 1] }} className='flex md:gap-10  gap-2 items-center'>
        <img src={profile} alt="profile" className='h-14' loading='lazy'/>
        <h2 className='flex lg:hidden' onClick={()=>setOpen(!open)}>
            <MenuIcon/>
        </h2>
    </motion.div>

</div>
  )
}

export default Sidebar