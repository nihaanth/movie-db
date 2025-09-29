import MovieCard from "../components/MovieCard"
import { useState,useEffect } from "react"
import '../css/Home.css'
import { searchMovies,getPopularMovies } from "../services/api"



function Home(){
    // movies will hold the list of films we want to show. We start with
    // an empty array because we have not asked the API for anything yet.
    const [movies,setMovies] = useState([])

    const [mode,setMode] = useState("")
    const [searchQuery,setSearchQuery] = useState("");
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);



    useEffect(() => {
        // React runs this block after the component shows up on the screen.
        // Keeping the dependency array empty means it only runs once, which
        // is where we will fetch movies and call setMovies with the results.
        //good to call a api
        const loadPopularMovies = async()=>{
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }
            catch(err){
                console.log(err)
                setError('failed to load movies')
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async (e) =>{
        e.preventDefault()

        if(!searchQuery.trimEnd()) return
        if(loading) return

        setLoading(true)
        try{
            const searchResult = await searchMovies(searchQuery)
        }
        catch(err){

            console.log(err)
            setError('failed to search Movies')

        }
        finally{
            setSearchQuery('');
        }
       

        setSearchQuery("")
    }
    const modeClick = () =>{

        setMode(mode === 'Dark'  ? 'light' : 'Dark')   
    }

    return <div className="home">

        <div>
            <p>Select the mode</p>
            <button onClick={modeClick} > {mode === 'Dark' ? '🌙' : '☀️'} </button>
        </div>
        <form onSubmit={handleSearch} className="search-form">
            <input type="text" 
            placeholder="Search the movies you want ... " 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit" className="search-button">Search</button>
        
        </form>

        {error && <div className="error-message">
            {error}
        </div> }

        {loading ? <div className="loading"> Loading ........</div> : 
         <div className="movies-grid">
            {movies && movies.map((movie) => 

                movie.title.toLocaleLowerCase().startsWith(searchQuery) && (
                <MovieCard movie = {movie} key= {movie.id} />
            )
            )}
        </div>
        }

       


    </div>
}

export default Home;
