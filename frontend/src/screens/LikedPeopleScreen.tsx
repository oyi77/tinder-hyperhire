import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import {useQuery} from 'react-query';
import SwipeableCard from '../components/organisms/SwipeableCard';
import Text from '../components/atoms/Text';
import {peopleService} from '../services/api';
import {Profile} from '../types';
import {getErrorMessage} from '../utils/errorHandler';

const {width, height} = Dimensions.get('window');

const LikedPeopleScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [showStartMessage, setShowStartMessage] = useState(false);
  const endMessageOpacity = React.useRef(new Animated.Value(0)).current;
  const startMessageOpacity = React.useRef(new Animated.Value(0)).current;

  const {
    data: likedProfiles,
    isLoading,
  } = useQuery('liked-people', peopleService.getLiked, {
    onError: (error) => {
      Alert.alert('Error', getErrorMessage(error));
    },
  });

  const showMessage = (isEnd: boolean) => {
    if (isEnd) {
      setShowEndMessage(true);
      Animated.sequence([
        Animated.timing(endMessageOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(endMessageOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowEndMessage(false);
      });
    } else {
      setShowStartMessage(true);
      Animated.sequence([
        Animated.timing(startMessageOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(startMessageOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowStartMessage(false);
      });
    }
  };

  const handleSwipeRight = () => {
    // Swipe right to go to next card
    if (!likedProfiles || likedProfiles.length === 0) return;
    
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= likedProfiles.length) {
        // Reached the end, show message and wrap to beginning
        showMessage(true);
        return 0; // Wrap to beginning for infinite scroll
      }
      return nextIndex;
    });
  };

  const handleSwipeLeft = () => {
    // Swipe left to go to previous card
    if (!likedProfiles || likedProfiles.length === 0) return;
    
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        // Reached the beginning, show message and wrap to end
        showMessage(false);
        return likedProfiles.length - 1; // Wrap to end for infinite scroll
      }
      return prevIndex;
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!likedProfiles || likedProfiles.length === 0) {
    return (
      <View style={styles.center}>
        <Text variant="body" style={styles.emptyText}>
          No liked people yet. Start swiping!
        </Text>
      </View>
    );
  }

  // Get visible profiles with circular wrapping for infinite scroll
  const getVisibleProfiles = () => {
    if (!likedProfiles || likedProfiles.length === 0) return [];
    
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % likedProfiles.length;
      visible.push(likedProfiles[index]);
    }
    return visible;
  };

  const visibleProfiles = getVisibleProfiles();
  const totalLiked = likedProfiles?.length || 0;
  const currentPosition = currentIndex + 1;

  return (
    <View style={styles.container}>
      {/* Counter display */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {currentPosition}/{totalLiked}
        </Text>
      </View>

      {/* End message */}
      {showEndMessage && (
        <Animated.View
          style={[styles.messageContainer, {opacity: endMessageOpacity}]}>
          <Text style={styles.messageText}>
            That's all the people you have liked, swipe left to see the other
          </Text>
        </Animated.View>
      )}

      {/* Start message */}
      {showStartMessage && (
        <Animated.View
          style={[styles.messageContainer, {opacity: startMessageOpacity}]}>
          <Text style={styles.messageText}>
            That's the first person you liked, swipe right to see the other
          </Text>
        </Animated.View>
      )}

      {visibleProfiles.map((profile, index) => {
        const scale = 1 - index * 0.05;
        const translateY = index * 10;
        const zIndex = visibleProfiles.length - index;

        return (
          <View
            key={`${profile.id}-${currentIndex}-${index}`}
            style={[
              styles.cardWrapper,
              {
                transform: [{scale}, {translateY}],
                zIndex,
              },
            ]}>
            <SwipeableCard
              profile={profile}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              index={index}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    paddingTop: 40,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  messageContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 12,
    zIndex: 2000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardWrapper: {
    position: 'absolute',
    width: width,
    height: height - 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default LikedPeopleScreen;

