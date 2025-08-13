// app/(tabs)/movies/[id].tsx
import { fetchMovieDetails } from '@/services/api';
import { addSavedMovie, isMovieSaved, removeSavedMovie } from '@/services/storage';
import useFetch from '@/services/useFetch';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-gray-200 font-normal text-sm">{label}</Text>
    <Text className="text-gray-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const [saved, setSaved] = useState(false);

  const refreshSaved = useCallback(async () => {
    if (!movie) return;
    const s = await isMovieSaved(movie.id);
    setSaved(s);
  }, [movie]);

  useEffect(() => {
    refreshSaved();
  }, [refreshSaved]);

  const toggleSave = async () => {
    if (!movie) return;
    if (saved) {
      await removeSavedMovie(movie.id);
    } else {
      await addSavedMovie({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
    }
    setSaved((prev) => !prev);
  };

  const formatMoney = (amount?: number | null) =>
    !amount || amount === 0
      ? 'N/A'
      : `$${(amount / 1_000_000).toFixed(1)} million`;

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          {/* Save icon */}
          <TouchableOpacity
            onPress={toggleSave}
            className="absolute top-14 right-5 bg-black/50 p-3 rounded-full"
          >
            <AntDesign
              name={saved ? 'heart' : 'hearto'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-gray-200 text-sm">
              {movie?.release_date?.split('-')[0]}
            </Text>
            <Text className="text-gray-200 text-sm">{movie?.runtime} m</Text>
          </View>

          <View className="flex-row items-center bg-dark-200 border border-gray-600 rounded-lg px-3 py-2 mt-3">
            <FontAwesome name="star" size={14} color="#FFD700" style={{ marginRight: 6 }} />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)} / 10
            </Text>
            <Text className="text-gray-200 text-sm ml-2">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo label="Budget" value={formatMoney(movie?.budget)} />
            <MovieInfo label="Revenue" value={formatMoney(movie?.revenue)} />
          </View>
          <MovieInfo
            label="Production Companies"
            value={movie?.production_companies?.map((c) => c.name).join(' - ') || 'N/A'}
          />
        </View>
      </ScrollView>

      {/* Back */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Feather name="chevron-left" size={18} color="#fff" style={{ marginRight: 4 }} />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;