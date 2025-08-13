import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";

const { width, height } = Dimensions.get("window");

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // Animated gradient position
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

  // Auto-scroll for trending list
  const trendingListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (!trendingMovies || trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      currentIndex.current += 1;

      if (currentIndex.current >= trendingMovies.length) {
        currentIndex.current = 0;
        trendingListRef.current?.scrollToIndex({
          index: 0,
          animated: false,
        });
      } else {
        trendingListRef.current?.scrollToIndex({
          index: currentIndex.current,
          animated: true,
        });
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [trendingMovies]);

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

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#00fff0"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text style={{ color: "#ff6b6b" }}>
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <BlurView
              intensity={50}
              tint="dark"
              style={{
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: "rgba(0,255,200,0.4)",
               marginBottom: 20,
              }}
            >
              <SearchBar
                onPress={() => {
                  router.push("/search");
                }}
                placeholder="Search for a movie"
              />
            </BlurView>

            {trendingMovies && (
              <View className="mt-10">
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
                  Trending Movies
                </Text>

                <FlatList
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  keyExtractor={(item) => item.movie_id.toString()}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                />
              </View>
            )}

            <>
              <Text
                style={{
                  fontSize: 18,
                  color: "#00fff0",
                  fontWeight: "bold",
                  marginTop: 20,
                  marginBottom: 8,
                  textShadowColor: "#00fff0",
                  textShadowRadius: 8,
                }}
              >
                Latest Movies
              </Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;