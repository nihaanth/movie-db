import MovieCard from "../components/MovieCard"
import { useState,useEffect } from "react"
import '../css/Home.css'
import { searchMovies,getPopularMovies } from "../services/api"
import { naturalLanguageSearch, getAIRecommendations, isAIEnabled, testAIConnection } from "../services/aiService"
import { useMovieContext } from "../contexts/MovieContext"



function Home(){
    // movies will hold the list of films we want to show. We start with
    // an empty array because we have not asked the API for anything yet.
    const [movies,setMovies] = useState([])
    const [aiRecommendations, setAiRecommendations] = useState([])

    const [mode,setMode] = useState("Dark")
    const [searchQuery,setSearchQuery] = useState("");
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [aiSearchEnabled, setAiSearchEnabled] = useState(false);
    const [showingRecommendations, setShowingRecommendations] = useState(false);

    const { favorites } = useMovieContext();



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

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode)
    }, [mode])

    const testConnection = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const result = await testAIConnection()
            setError(`Connection test: ${result}`)
        } catch (err) {
            setError(`Connection failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleAIRecommendations = async () => {
        if (!isAIEnabled()) {
            setError('OpenAI API key not configured')
            return
        }

        if (favorites.length === 0) {
            setError('Add some movies to favorites first to get AI recommendations')
            return
        }

        setLoading(true)
        setError(null)
        
        try {
            console.log('Getting recommendations for favorites:', favorites)
            const recommendations = await getAIRecommendations(favorites)
            console.log('Received recommendations:', recommendations)
            setAiRecommendations(recommendations)
            setShowingRecommendations(true)
        } catch (err) {
            console.error('AI Recommendations error:', err)
            setError(`Failed to get AI recommendations: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) =>{
        e.preventDefault()

        if(!searchQuery.trim()) return
        if(loading) return

        setLoading(true)
        setError(null)
        setShowingRecommendations(false)
        
        try{
            let searchResult;
            
            if (aiSearchEnabled && isAIEnabled()) {
                const aiParams = await naturalLanguageSearch(searchQuery)
                searchResult = await searchMovies(aiParams.searchTerms)
            } else {
                searchResult = await searchMovies(searchQuery)
            }
            
            setMovies(searchResult)
        }
        catch(err){
            console.log(err)
            setError('Failed to search movies')
        }
        finally{
            setLoading(false)
        }
    }
    const modeClick = () =>{

        setMode(mode === 'Dark'  ? 'light' : 'Dark')   
    }

    return <div className="home">

        <div className="theme-toggle">
            <p>Theme:</p>
            <button onClick={modeClick} title={`Switch to ${mode === 'Dark' ? 'Light' : 'Dark'} Mode`}>
                {mode === 'Dark' ? '🌙' : '☀️'}
            </button>
        </div>

        <div className="ai-controls">
            {isAIEnabled() ? (
                <>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={aiSearchEnabled}
                            onChange={(e) => setAiSearchEnabled(e.target.checked)}
                        />
                        Enable AI Smart Search
                    </label>
                    <button 
                        onClick={testConnection}
                        className="test-connection-btn"
                        disabled={loading}
                    >
                        Test AI Connection
                    </button>
                    <button 
                        onClick={handleAIRecommendations}
                        className="ai-recommendations-btn"
                        disabled={loading || favorites.length === 0}
                    >
                        Get AI Recommendations ({favorites.length} favorites)
                    </button>
                </>
            ) : (
                <div className="ai-disabled-notice">
                    <p>🤖 AI features disabled</p>
                    <small>Configure AI service in .env file to enable smart search and recommendations</small>
                </div>
            )}
        </div>

        <form onSubmit={handleSearch} className="search-form">
            <input type="text" 
            placeholder={aiSearchEnabled ? "Try: 'funny movies from the 90s' or 'sci-fi with time travel'" : "Search the movies you want ..."} 
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
         <>
            {showingRecommendations && aiRecommendations.length > 0 && (
                <div className="ai-recommendations-section">
                    <h2>🤖 AI Recommendations for You</h2>
                    <div className="recommendations-grid">
                        {aiRecommendations.map((rec, index) => (
                            <div key={index} className="recommendation-card">
                                <h3>{rec.title}</h3>
                                <p>{rec.reason}</p>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setShowingRecommendations(false)}
                        className="back-to-movies-btn"
                    >
                        Back to Movies
                    </button>
                </div>
            )}
            
            {!showingRecommendations && (
                <div className="movies-grid">
                    {movies && movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
         </>
        }

       


    </div>
}

export default Home;
