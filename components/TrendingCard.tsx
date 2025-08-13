import { images } from '@/constants/images'
import MaskedView from '@react-native-masked-view/masked-view'
import { Link } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

const TrendingCard = ({ movie: { movie_id, title, poster_url }, index }: TrendingCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const delay = index * 500
    const loopAnim = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.delay(1500)
      ]).start(() => loopAnim())
    }
    loopAnim()
  }, [index, scaleAnim])

  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity activeOpacity={0.8}>
        <Animated.View
          style={{
            width: screenWidth * 0.9,
            alignItems: 'center',
            transform: [{ scale: scaleAnim }]
          }}
        >
          {/* Poster with glow */}
          <View
            style={{
              width: screenWidth * 0.9,
              height: (screenWidth * 0.9) * 0.7,
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: '#000' // fills behind the image
            }}
          >
            <Image
              source={{ uri: poster_url }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode='contain' // show full image without cropping
            />
          </View>

          {/* Ranking Number */}
          <View style={{
            position: 'absolute',
            bottom: 50,
            left: 20
          }}>
            <MaskedView
              maskElement={
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 64
                  }}
                >
                  {index + 1}
                </Text>
              }
            >
              <Image
                source={images.rankingGradient}
                style={{ width: 80, height: 80 }}
                resizeMode='cover'
              />
            </MaskedView>
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 8,
              color: '#e0faff',
              textShadowColor: '#00fff0',
              textShadowRadius: 6,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard
