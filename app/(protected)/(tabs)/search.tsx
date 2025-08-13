import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";

import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { getCurrentUser, updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

import MovieDisplayCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";

const { width, height } = Dimensions.get("window");

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect
  useEffect(() => {
  const timeoutId = setTimeout(async () => {
    if (searchQuery.trim()) {
      const newMovies = await loadMovies(); // Get fresh data
      console.log('After fetch, movies:', newMovies); // Debug
      if (newMovies?.length > 0 && newMovies[0]) {
        const user = await getCurrentUser();
        console.log('User:', user); // Debug
        if (user) {
          console.log('Calling updateSearchCount with:', {
            searchQuery,
            movie: newMovies[0],
            userId: user.$id,
          }); // Debug
          await updateSearchCount(searchQuery, newMovies[0], user.$id);
        } else {
          console.log('No user logged in');
        }
      } else {
        console.log('No movies found for query:', searchQuery);
      }
    } else {
      reset();
    }
  }, 500);
  return () => clearTimeout(timeoutId);
}, [searchQuery]);

  // Shimmer animation
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Animated shimmer gradient */}
      <Animated.View
        style={{
          position: "absolute",
          width: width * 2,
          height,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            "rgba(0,255,200,0.05)",
            "rgba(0,255,255,0.15)",
            "rgba(255,0,255,0.05)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <FlatList
        className="px-5"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Logo */}
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Glassy SearchBar */}
            <BlurView
              intensity={50}
              tint="dark"
              style={{
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: "rgba(0,255,200,0.4)",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </BlurView>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#00fff0"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text
                  style={{
                    fontSize: 18,
                    color: "#00fff0",
                    fontWeight: "bold",
                    marginBottom: 8,
                    textShadowColor: "#00fff0",
                    textShadowRadius: 8,
                  }}
                >
                  Search Results for{" "}
                  <Text style={{ color: "#00fff0" }}>{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-400">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
