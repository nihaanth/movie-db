# Movie Database App

A React-based movie database application that allows users to browse popular movies, search for specific titles, and manage their favorite movies.

## Features

- **Browse Popular Movies**: View trending and popular movies from The Movie Database (TMDb)
- **Search Functionality**: Search for movies by title
- **Favorites Management**: Add/remove movies to/from your favorites list
- **Persistent Storage**: Favorites are saved to localStorage
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **Context API** - State management for favorites
- **localStorage** - Persistent data storage
- **TMDb API** - Movie data source
- **CSS3** - Styling and responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── MovieCard.jsx       # Individual movie card component
├── contexts/
│   └── MovieContext.jsx    # Context for favorites management
├── css/
│   ├── Home.css
│   ├── Favorites.css
│   └── MovieCard.css
├── pages/
│   ├── Home.jsx           # Main page with movie grid
│   └── Favorites.jsx      # Favorites page
├── services/
│   └── api.js            # TMDb API integration
└── main.jsx              # App entry point
```

## API Integration

This app uses The Movie Database (TMDb) API to fetch movie data. The API provides:
- Popular movies
- Movie search functionality
- Movie posters and metadata

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
