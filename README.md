# Movie Database App

A modern React-based movie database application with AI-powered recommendations, smart search, and beautiful theming. Browse popular movies, get personalized recommendations, and manage your favorites with an intuitive interface.

## Features

- **AI-Powered Recommendations**: Get personalized movie suggestions based on your favorites
- **Smart Search**: Natural language search (e.g., "funny movies from the 90s")
- **Browse Popular Movies**: Discover trending and popular movies from TMDb
- **Favorites Management**: Add/remove movies with persistent storage
- **Dark/Light Mode**: Beautiful theme switching with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Local AI**: Works without API keys using built-in recommendation engine
- **Advanced Search**: Regular and AI-enhanced search capabilities

## Technologies Used

- **React** - Frontend framework with hooks and context
- **Vite** - Fast build tool and development server
- **Context API** - State management for favorites and themes
- **localStorage** - Persistent data storage
- **TMDb API** - Movie data source and search
- **Local AI** - Rule-based recommendation engine
- **CSS3** - Advanced styling with CSS variables and theming
- **OpenAI API** - Optional enhanced AI features (requires API key)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nihaanth/movie-db.git
   cd movie-db
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure API keys** (see API Setup section below)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## API Setup

### Required: TMDb API Key

1. **Get a free API key from The Movie Database:**
   - Visit [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Create an account and log in
   - Go to Settings > API
   - Request an API key (choose "Developer" option)
   - Copy your API key

2. **Add to your .env file:**
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

### Optional: OpenAI API Key (Enhanced AI Features)

The app works with built-in Local AI, but you can enable enhanced AI features:

1. **Get OpenAI API key:**
   - Visit [https://platform.openai.com/](https://platform.openai.com/)
   - Create account and add payment method
   - Go to API Keys section
   - Create new API key

2. **Add to your .env file:**
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_USE_LOCAL_AI=false
   ```

### Local AI Mode (No API Key Required)

For free AI recommendations without OpenAI:

```env
VITE_USE_LOCAL_AI=true
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required - TMDb API for movie data
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Optional - OpenAI for enhanced AI features
VITE_OPENAI_API_KEY=your_openai_api_key_here

# AI Configuration
VITE_USE_LOCAL_AI=true
```

## Project Structure

```
movie-db/
├── public/
├── src/
│   ├── components/
│   │   ├── MovieCard.jsx      # Individual movie card component
│   │   └── Navbar.jsx         # Navigation component
│   ├── contexts/
│   │   └── MovieContext.jsx   # Context for favorites management
│   ├── css/
│   │   ├── App.css           # Global app styles
│   │   ├── Home.css          # Home page styles with theme support
│   │   ├── Favorites.css     # Favorites page styles
│   │   ├── MovieCard.css     # Movie card component styles
│   │   ├── Navbar.css        # Navigation styles
│   │   └── index.css         # Root styles and CSS variables
│   ├── pages/
│   │   ├── Home.jsx          # Main page with search and recommendations
│   │   └── Favorites.jsx     # Favorites management page
│   ├── services/
│   │   ├── api.js            # TMDb API integration
│   │   ├── aiService.js      # AI service coordinator
│   │   └── localAI.js        # Local recommendation engine
│   ├── App.jsx               # Main app component with routing
│   └── main.jsx              # App entry point
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment variables template
└── README.md
```

## Key Features Explained

### AI Recommendations
- **Local AI**: Rule-based recommendation engine that analyzes favorite movie genres
- **OpenAI Integration**: Enhanced natural language processing for search and recommendations
- **Smart Analysis**: Considers genre preferences, release years, and movie patterns

### Theme System
- **CSS Variables**: Dynamic theming with smooth transitions
- **Persistent Preferences**: Theme choice saved to localStorage
- **Responsive Design**: Optimized for all screen sizes

### Search Capabilities
- **Basic Search**: Traditional movie title search
- **AI Search**: Natural language queries like "funny movies from the 90s"
- **Real-time Results**: Instant search with loading states

## Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Usage

1. **Browse Movies**: Popular movies load automatically on the home page
2. **Search**: Use the search bar for basic or AI-enhanced search
3. **Add Favorites**: Click the heart icon on any movie card
4. **Get Recommendations**: Click "Get AI Recommendations" after adding favorites
5. **Toggle Theme**: Use the theme button to switch between light and dark modes
6. **View Favorites**: Navigate to the Favorites page to see your saved movies

## Troubleshooting

### Common Issues

**Movies not loading:**
- Check if TMDB API key is correctly set in .env file
- Verify internet connection
- Check browser console for error messages

**AI features not working:**
- Ensure VITE_USE_LOCAL_AI=true for local recommendations
- For OpenAI features, verify API key and billing setup
- Check browser console for detailed error messages

**Theme not switching:**
- Check if CSS files are loaded properly
- Verify browser supports CSS custom properties
- Clear browser cache and reload

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
