
import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import { Routes,Route } from 'react-router-dom'
import { MovieProvider } from './contexts/MovieContext'
import NavBar from './components/navBar'


function App() {

  // const movieNumber = 1



  return (
   <>
   {

    <MovieProvider>
      <NavBar />
   <main className='main-content'>
    <Routes>
    <Route path = "/" element = {<Home />}/>
    <Route path='/favorites' element = {<Favorites />}/>
    </Routes>
   </main>
   </MovieProvider>
   /* this is the conditional display for the movie in jsx{movieNumber ===1 ? (<MovieCard movie = {{title:'RRR - Rise, Roar, Revolt',release_data:'2023'}}></MovieCard>)
   :
   (
   <MovieCard movie = {{title:'Pushpa 2',release_data:'2025'}}></MovieCard>)}
  */
  
  
  }
   
  </>

  )
}


export default App
