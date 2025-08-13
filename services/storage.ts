// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@MyApp:SavedMovies';

export type SavedMovie = {
  id: number;
  title: string;
  poster_path: string;
};

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const addSavedMovie = async (movie: SavedMovie) => {
  const list = await getSavedMovies();
  if (list.some((m) => m.id === movie.id)) return;
  list.push(movie);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const removeSavedMovie = async (id: number) => {
  const list = await getSavedMovies();
  const filtered = list.filter((m) => m.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const isMovieSaved = async (id: number): Promise<boolean> => {
  const list = await getSavedMovies();
  return list.some((m) => m.id === id);
};