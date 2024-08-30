import Sidebar from '../components/Sidebar';
import ListView from '../components/ListView';
import Player from '../components/Player';
function Home() {

  return (
    <div className=' lg:h-screen h-[80vh] text-zinc-100 flex flex-col lg:flex-row '>

      {/* sidebar */}
      <Sidebar/>

      {/* track lists */}
      <ListView  />
      

      {/* player */}

      <Player/>    
    
    </div>
  )
}

export default Home