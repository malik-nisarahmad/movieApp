export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch movies: ${response.status} - ${errorText}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.results || [];
    } else {
      throw new Error('Invalid response format: not JSON');
    }
  } catch (err: any) {
    console.error('fetchMovies error:', err.message);
    throw err;
  }
};


export const fetchMovieDetails = async (_movieId:string): Promise<MovieDetails> => {
  try{
    const response=await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${_movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });
    if(!response.ok) throw new Error('Failed to fetch movie details');

    const data=await response.json();
    return data as MovieDetails;
  }catch(error){
    console.log(error);
    throw error;
  }
}