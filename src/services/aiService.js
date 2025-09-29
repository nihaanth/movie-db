import OpenAI from 'openai';
import { 
  isLocalAIEnabled, 
  getLocalRecommendations, 
  parseNaturalLanguage, 
  testLocalAI,
  getHuggingFaceRecommendation 
} from './localAI.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend API
});

// Check if any AI is enabled (OpenAI or Local)
export const isAIEnabled = () => {
  // Check local AI first
  if (isLocalAIEnabled()) {
    console.log('Local AI enabled');
    return true;
  }
  
  // Check OpenAI
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log('API Key check:', apiKey ? 'Present' : 'Missing', apiKey?.substring(0, 10) + '...');
  return apiKey && apiKey !== 'your_openai_api_key_here';
};

// Test AI connection (local or OpenAI)
export const testAIConnection = async () => {
  if (!isAIEnabled()) {
    throw new Error('No AI service configured');
  }

  // Use local AI if enabled
  if (isLocalAIEnabled()) {
    return await testLocalAI();
  }

  // Fall back to OpenAI
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'Connection successful' if you can read this."
        }
      ],
      max_tokens: 10
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    throw error;
  }
};

// Generate movie recommendations (local or OpenAI)
export const getAIRecommendations = async (favoriteMovies, preferences = '') => {
  if (!isAIEnabled()) {
    throw new Error('No AI service configured');
  }

  // Use local AI if enabled
  if (isLocalAIEnabled()) {
    console.log('Using local AI for recommendations');
    try {
      // Try Hugging Face first, fall back to local rules
      return await getHuggingFaceRecommendation(favoriteMovies);
    } catch (error) {
      console.log('Hugging Face failed, using local recommendations');
      return await getLocalRecommendations(favoriteMovies);
    }
  }

  // Fall back to OpenAI
  try {
    const movieTitles = favoriteMovies.map(movie => movie.title).join(', ');
    
    const prompt = `Based on these favorite movies: ${movieTitles}
    ${preferences ? `User preferences: ${preferences}` : ''}
    
    Recommend 5 similar movies that the user might enjoy. For each movie, provide:
    1. Title
    2. Brief reason why it matches their taste (1-2 sentences)
    
    Format as JSON array:
    [
      {
        "title": "Movie Title",
        "reason": "Brief explanation"
      }
    ]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation expert. Provide accurate, popular movie suggestions in the requested JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    console.log('OpenAI Response:', content);
    
    const recommendations = JSON.parse(content);
    return recommendations;
  } catch (error) {
    console.error('OpenAI failed, falling back to local AI');
    return await getLocalRecommendations(favoriteMovies);
  }
};

// Natural language movie search (local or OpenAI)
export const naturalLanguageSearch = async (query) => {
  if (!isAIEnabled()) {
    throw new Error('No AI service configured');
  }

  // Use local AI if enabled
  if (isLocalAIEnabled()) {
    console.log('Using local AI for natural language search');
    return await parseNaturalLanguage(query);
  }

  // Fall back to OpenAI
  try {
    const prompt = `Convert this natural language movie search into specific movie search terms and filters:
    "${query}"
    
    Extract:
    1. Main search keywords (movie titles, actors, directors)
    2. Genre preferences
    3. Time period/year range
    4. Mood/theme
    
    Return as JSON:
    {
      "searchTerms": "main keywords for TMDB search",
      "genre": "genre if mentioned",
      "yearRange": "year range if mentioned",
      "mood": "mood/theme description"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie search assistant. Extract search parameters from natural language queries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const searchParams = JSON.parse(response.choices[0].message.content);
    return searchParams;
  } catch (error) {
    console.error('OpenAI natural language search failed, using local fallback');
    return await parseNaturalLanguage(query);
  }
};

// Generate movie summary/review
export const generateMovieSummary = async (movie) => {
  if (!isAIEnabled()) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = `Generate a compelling 2-3 sentence summary for the movie "${movie.title}" (${movie.release_date?.split('-')[0]}).
    
    Original overview: ${movie.overview}
    
    Make it engaging and highlight what makes this movie special. Focus on themes, style, and why someone should watch it.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie critic who writes engaging, concise movie summaries that capture the essence of films."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Movie Summary Error:', error);
    throw new Error('Failed to generate movie summary');
  }
};

// Movie chatbot for recommendations and discussions
export const movieChatbot = async (userMessage, conversationHistory = []) => {
  if (!isAIEnabled()) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const messages = [
      {
        role: "system",
        content: `You are a knowledgeable and enthusiastic movie expert chatbot. You help users discover new movies, discuss films, answer movie trivia, and provide personalized recommendations.

        Guidelines:
        - Be conversational and engaging
        - Provide specific movie recommendations when asked
        - Share interesting movie facts and trivia
        - Help users discover movies based on their mood, preferences, or criteria
        - Keep responses concise but informative
        - Always be positive and helpful about movies`
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 400,
      temperature: 0.8
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Movie Chatbot Error:', error);
    throw new Error('Failed to get chatbot response');
  }
};