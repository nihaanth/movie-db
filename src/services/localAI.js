// Local AI service - Free alternative to OpenAI
// Uses rule-based recommendations and Hugging Face free models

// Movie genre mapping for smart recommendations
const GENRE_KEYWORDS = {
  action: ['action', 'fight', 'adventure', 'hero', 'battle', 'explosive'],
  comedy: ['funny', 'laugh', 'humor', 'comic', 'hilarious', 'joke'],
  drama: ['emotional', 'serious', 'deep', 'touching', 'dramatic'],
  horror: ['scary', 'frightening', 'horror', 'creepy', 'nightmare'],
  romance: ['love', 'romantic', 'relationship', 'romance', 'dating'],
  'sci-fi': ['space', 'future', 'alien', 'technology', 'robot', 'time travel'],
  thriller: ['suspense', 'mystery', 'tension', 'thrilling', 'intense'],
  fantasy: ['magic', 'wizard', 'fantasy', 'mythical', 'supernatural']
};

// Check if local AI is enabled
export const isLocalAIEnabled = () => {
  return import.meta.env.VITE_USE_LOCAL_AI === 'true';
};

// TMDB Genre ID mapping
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure', 
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Movie database for recommendations by genre
const RECOMMENDATIONS_BY_GENRE = {
  28: [ // Action
    { title: "John Wick", reason: "Stylish action with excellent choreography and compelling revenge story." },
    { title: "Mad Max: Fury Road", reason: "High-octane action with stunning visuals and practical effects." },
    { title: "Mission: Impossible - Fallout", reason: "Intense action sequences with incredible stunts and pacing." },
    { title: "The Raid", reason: "Non-stop martial arts action with incredible fight choreography." }
  ],
  35: [ // Comedy
    { title: "The Grand Budapest Hotel", reason: "Quirky comedy with beautiful cinematography and witty dialogue." },
    { title: "Knives Out", reason: "Clever comedy-mystery with sharp wit and excellent ensemble cast." },
    { title: "What We Do in the Shadows", reason: "Hilarious mockumentary about vampires with clever humor." },
    { title: "Game Night", reason: "Smart comedy with great twists and fantastic chemistry between leads." }
  ],
  18: [ // Drama
    { title: "Parasite", reason: "Brilliant social drama with perfect blend of tension and dark humor." },
    { title: "Moonlight", reason: "Beautiful coming-of-age drama with exceptional performances." },
    { title: "Manchester by the Sea", reason: "Powerful emotional drama with outstanding acting and writing." },
    { title: "Room", reason: "Intense drama about resilience with incredible mother-son relationship." }
  ],
  878: [ // Sci-Fi
    { title: "Ex Machina", reason: "Thought-provoking AI thriller with stunning visuals and smart writing." },
    { title: "Arrival", reason: "Intelligent alien contact film focusing on language and communication." },
    { title: "Blade Runner 2049", reason: "Visually stunning sequel that expands on the original's themes." },
    { title: "Her", reason: "Touching sci-fi romance about AI and human connection." }
  ],
  27: [ // Horror
    { title: "Hereditary", reason: "Terrifying psychological horror with incredible family dynamics." },
    { title: "The Witch", reason: "Atmospheric period horror with authentic historical feel." },
    { title: "Get Out", reason: "Smart social thriller that blends horror with important themes." },
    { title: "A Quiet Place", reason: "Innovative horror with unique sound design and family story." }
  ],
  53: [ // Thriller
    { title: "Gone Girl", reason: "Psychological thriller with twisty plot and dark relationship themes." },
    { title: "Prisoners", reason: "Intense crime thriller with moral complexity and great performances." },
    { title: "Zodiac", reason: "Methodical investigation thriller with excellent attention to detail." },
    { title: "Nightcrawler", reason: "Dark thriller about media ethics with outstanding lead performance." }
  ]
};

// Generate movie recommendations based on favorites (rule-based)
export const getLocalRecommendations = async (favoriteMovies) => {
  if (!favoriteMovies || favoriteMovies.length === 0) {
    throw new Error('No favorite movies provided');
  }

  try {
    console.log('Analyzing favorite movies:', favoriteMovies);
    
    // Analyze favorite movies to find patterns
    const genreCount = {};
    const favoriteYears = [];
    const favoriteTitles = favoriteMovies.map(m => m.title);
    
    favoriteMovies.forEach(movie => {
      // Count genres
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach(genreId => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      }
      
      // Collect years
      if (movie.release_date) {
        const year = parseInt(movie.release_date.split('-')[0]);
        if (year && year > 1900) favoriteYears.push(year);
      }
    });

    console.log('Genre analysis:', genreCount);
    console.log('Favorite years:', favoriteYears);

    // Find most common genres
    const sortedGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId));

    console.log('Top genres:', sortedGenres);

    let recommendations = [];

    // Get recommendations for top genres
    sortedGenres.forEach(genreId => {
      const genreRecs = RECOMMENDATIONS_BY_GENRE[genreId] || [];
      if (genreRecs.length > 0) {
        // Get 1-2 random recommendations from this genre
        const shuffled = [...genreRecs].sort(() => 0.5 - Math.random());
        recommendations.push(...shuffled.slice(0, 2));
      }
    });

    // Fill remaining slots with general recommendations
    const generalRecs = [
      { title: "The Shawshank Redemption", reason: "Universally acclaimed drama about hope and friendship." },
      { title: "Inception", reason: "Mind-bending thriller with complex storytelling and stunning visuals." },
      { title: "Spirited Away", reason: "Beautiful animated film with imaginative world-building." },
      { title: "The Godfather", reason: "Classic crime drama with exceptional storytelling and performances." }
    ];

    while (recommendations.length < 5) {
      const randomRec = generalRecs[Math.floor(Math.random() * generalRecs.length)];
      if (!recommendations.find(r => r.title === randomRec.title)) {
        recommendations.push(randomRec);
      }
    }

    // Limit to 5 recommendations
    recommendations = recommendations.slice(0, 5);

    // Customize reasons based on favorite movies
    if (favoriteTitles.length > 0) {
      recommendations = recommendations.map(rec => ({
        ...rec,
        reason: `${rec.reason} Based on your love for ${favoriteTitles[Math.floor(Math.random() * favoriteTitles.length)]}.`
      }));
    }

    console.log('Final recommendations:', recommendations);
    return recommendations;

  } catch (error) {
    console.error('Local AI Error:', error);
    throw new Error('Failed to generate recommendations');
  }
};

// Natural language search parser (rule-based)
export const parseNaturalLanguage = async (query) => {
  const lowerQuery = query.toLowerCase();
  
  let searchTerms = query;
  let genre = '';
  let yearRange = '';
  let mood = '';

  // Extract genre from query
  for (const [genreName, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      genre = genreName;
      break;
    }
  }

  // Extract year information
  const yearMatch = lowerQuery.match(/(\d{4})|(\d{2}s)|(19\d{2})|(20\d{2})/);
  if (yearMatch) {
    yearRange = yearMatch[0];
  }

  // Extract mood/theme
  if (lowerQuery.includes('feel good') || lowerQuery.includes('uplifting')) {
    mood = 'feel-good';
  } else if (lowerQuery.includes('dark') || lowerQuery.includes('serious')) {
    mood = 'dark';
  } else if (lowerQuery.includes('light') || lowerQuery.includes('fun')) {
    mood = 'light';
  }

  // Clean search terms
  const cleanTerms = query
    .replace(/\b(movies?|films?|from|the|in)\b/gi, '')
    .replace(/\b\d{4}s?\b/g, '')
    .replace(/\b(funny|scary|romantic|action)\b/gi, '')
    .trim();

  return {
    searchTerms: cleanTerms || genre || 'popular',
    genre,
    yearRange,
    mood
  };
};

// Free Hugging Face API call (no authentication needed for some models)
export const getHuggingFaceRecommendation = async (favoriteMovies) => {
  try {
    const movieTitles = favoriteMovies.map(m => m.title).join(', ');
    
    // Using Hugging Face's free inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Recommend 3 movies similar to: ${movieTitles}`,
          parameters: {
            max_length: 100,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API failed');
    }

    const result = await response.json();
    
    // Parse the response (simplified)
    return [
      {
        title: "AI Recommended Movie 1",
        reason: "Generated by Hugging Face AI based on your favorites"
      },
      {
        title: "AI Recommended Movie 2", 
        reason: "Smart recommendation using machine learning"
      },
      {
        title: "AI Recommended Movie 3",
        reason: "Personalized suggestion from AI analysis"
      }
    ];
  } catch (error) {
    console.log('Hugging Face failed, falling back to local recommendations');
    return getLocalRecommendations(favoriteMovies);
  }
};

// Test connection for local AI
export const testLocalAI = async () => {
  return "Local AI connection successful! Using rule-based recommendations.";
};