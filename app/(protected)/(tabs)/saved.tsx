// app/(tabs)/saved.tsx
import { getSavedMovies, removeSavedMovie, SavedMovie } from '@/services/storage';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Saved = () => {
  const [movies, setMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Animated shimmer ---------- */
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  /* ---------- Load saved ---------- */
  const load = useCallback(async () => {
    setLoading(true);
    const data = await getSavedMovies();
    setMovies(data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const unsave = async (id: number) => {
    await removeSavedMovie(id);
    load();
  };

  /* ---------- Render ---------- */
  const renderItem = ({ item }: { item: SavedMovie }) => (
    <View className="relative mb-5">
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        className="w-28 h-40 rounded"
      />
      <TouchableOpacity
        onPress={() => unsave(item.id)}
        className="absolute -top-2 -right-2 bg-black/70 p-1.5 rounded-full"
      >
        <AntDesign name="heart" size={18} color="#ff0040" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      {/* Shimmer always mounted */}
      <Animated.View
        style={{
          position: 'absolute',
          width: width * 2,
          height,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            'rgba(0,255,200,0.05)',
            'rgba(0,255,255,0.15)',
            'rgba(255,0,255,0.05)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {loading ? (
        <View className="flex-1 bg-primary items-center justify-center">
          <ActivityIndicator size="large" color="#00fff0" />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
          ListHeaderComponent={
            <Text
              className="text-[18px] text-cyan-300 font-bold mb-6 px-5"
              style={{ textShadowColor: '#00fff0', textShadowRadius: 8 }}
            >
              Saved Movies
            </Text>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <AntDesign name="save" size={40} color="#fff" />
              <Text className="text-gray-400 text-base mt-2">No saved movies yet</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default Saved;