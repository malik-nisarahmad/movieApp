// TrendingCubeSlider.tsx
import { images } from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const TrendingCubeSlider = ({ data }: { data: TrendingCardProps['movie'][] }) => {
  return (
    <View style={{ height: 300 }}>
      <Swiper
        autoplay
        autoplayTimeout={2}
        loop
        showsPagination={false}
        horizontal
        removeClippedSubviews={false}
        containerStyle={{}}
      >
        {data.map((movie, index) => (
          <CubeCard key={movie.movie_id} movie={movie} index={index} />
        ))}
      </Swiper>
    </View>
  );
};

const CubeCard = ({ movie: { movie_id, title, poster_url }, index }: TrendingCardProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'], // cube-like flip
  });

  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <Animated.View style={[styles.card, { transform: [{ rotateY }] }]}>
        <Image source={{ uri: poster_url }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rank}>
          <MaskedView
            maskElement={<Text style={styles.rankText}>{index + 1}</Text>}
          >
            <Image source={images.rankingGradient} style={styles.rankImg} />
          </MaskedView>
        </View>
      </Animated.View>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.7,
    height: 250,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#00fff0',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  image: { width: '100%', height: '100%', borderRadius: 20 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  rank: { position: 'absolute', top: 10, left: 10 },
  rankText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  rankImg: { width: 50, height: 50 },
});

export default TrendingCubeSlider;
