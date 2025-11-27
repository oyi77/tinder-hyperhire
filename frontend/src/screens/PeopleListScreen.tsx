import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useInfiniteQuery, useMutation, useQueryClient} from 'react-query';
import SwipeableCard, {SwipeableCardRef} from '../components/organisms/SwipeableCard';
import Text from '../components/atoms/Text';
import {peopleService} from '../services/api';
import {Profile} from '../types';
import {getErrorMessage} from '../utils/errorHandler';

const {width, height} = Dimensions.get('window');

const PeopleListScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<Array<{profile: Profile; action: 'like' | 'dislike'}>>([]);
  const [showLikeSticker, setShowLikeSticker] = useState(false);
  const [showDislikeSticker, setShowDislikeSticker] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const likeStickerOpacity = useRef(new Animated.Value(0)).current;
  const dislikeStickerOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardRef = useRef<SwipeableCardRef>(null);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    'recommended-people',
    ({pageParam = 1}) => peopleService.getRecommended(pageParam, 10),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.last_page) {
          return lastPage.current_page + 1;
        }
        return undefined;
      },
      onError: (error) => {
        Alert.alert('Error', getErrorMessage(error));
      },
    },
  );

  const showLikeFeedback = () => {
    // Reset opacity first
    likeStickerOpacity.setValue(0);
    setShowLikeSticker(true);
    Animated.sequence([
      Animated.timing(likeStickerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(likeStickerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLikeSticker(false);
      likeStickerOpacity.setValue(0);
    });
  };

  const showDislikeFeedback = () => {
    // Reset opacity first
    dislikeStickerOpacity.setValue(0);
    setShowDislikeSticker(true);
    Animated.sequence([
      Animated.timing(dislikeStickerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(dislikeStickerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDislikeSticker(false);
      dislikeStickerOpacity.setValue(0);
    });
  };

  const likeMutation = useMutation(peopleService.like, {
    onMutate: async () => {
      const allProfiles = data?.pages.flatMap((page) => page.data) || [];
      const currentProfile = allProfiles[currentIndex];
      if (currentProfile) {
        setHistory((prev) => [...prev, {profile: currentProfile, action: 'like'}]);
      }
    },
    onSuccess: (responseData) => {
      if (responseData.match) {
        setTimeout(() => {
          Alert.alert('It\'s a match!', 'You both liked each other!');
        }, 800);
      }
      setTimeout(() => {
        handleNext();
      }, 800);
    },
    onError: (error) => {
      // Revert optimistic update on error
      setHistory((prev) => prev.slice(0, -1));
      Alert.alert('Error', getErrorMessage(error));
    },
  });

  const dislikeMutation = useMutation(peopleService.dislike, {
    onMutate: async () => {
      const allProfiles = data?.pages.flatMap((page) => page.data) || [];
      const currentProfile = allProfiles[currentIndex];
      if (currentProfile) {
        setHistory((prev) => [...prev, {profile: currentProfile, action: 'dislike'}]);
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        handleNext();
      }, 800);
    },
    onError: (error) => {
      // Revert optimistic update on error
      setHistory((prev) => prev.slice(0, -1));
      Alert.alert('Error', getErrorMessage(error));
    },
  });

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      const allProfiles = data?.pages.flatMap((page) => page.data) || [];
      if (newIndex >= allProfiles.length - 3 && hasNextPage) {
        fetchNextPage();
      }
      return newIndex;
    });
  };

  const handleSwipeRight = (profile: Profile) => {
    // Show sticker animation when swiping manually
    showLikeFeedback();
    likeMutation.mutate(profile.id);
  };

  const handleSwipeLeft = (profile: Profile) => {
    // Show sticker animation when swiping manually
    showDislikeFeedback();
    dislikeMutation.mutate(profile.id);
  };

  const handleLikeButton = () => {
    if (currentProfile) {
      // Show sticker animation immediately
      showLikeFeedback();
      // Trigger swipe animation
      cardRef.current?.swipeRight();
      // Mutation will be called by handleSwipeRight after animation
    }
  };

  const handleDislikeButton = () => {
    if (currentProfile) {
      // Show sticker animation immediately
      showDislikeFeedback();
      // Trigger swipe animation
      cardRef.current?.swipeLeft();
      // Mutation will be called by handleSwipeLeft after animation
    }
  };

  const handleUndo = async () => {
    if (history.length === 0) {
      Alert.alert('No Action', 'No previous action to undo');
      return;
    }

    const lastAction = history[history.length - 1];
    
    try {
      if (lastAction.action === 'like') {
        await peopleService.undoLike(lastAction.profile.id);
      } else {
        await peopleService.undoDislike(lastAction.profile.id);
      }
      
      // Remove from history
      setHistory((prev) => prev.slice(0, -1));
      
      // Go back to previous index
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries('recommended-people');
    } catch (error: any) {
      Alert.alert('Error', getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const allProfiles = data?.pages.flatMap((page) => page.data) || [];
  const visibleProfiles = allProfiles.slice(currentIndex, currentIndex + 3);
  const currentProfile = allProfiles[currentIndex];

  if (visibleProfiles.length === 0 && !isLoading) {
    return (
      <View style={styles.center}>
        <Text variant="h3" style={styles.emptyText}>
          No more people to discover!
        </Text>
        <Text variant="body" style={styles.emptySubtext}>
          Check back later for new profiles
        </Text>
      </View>
    );
  }

  if (visibleProfiles.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {visibleProfiles.map((profile, index) => {
        const scale = 1 - index * 0.05;
        const translateY = index * 10;
        const zIndex = visibleProfiles.length - index;

        return (
          <View
            key={profile.id}
            style={[
              styles.cardWrapper,
              {
                transform: [{scale}, {translateY}],
                zIndex,
              },
            ]}>
            <SwipeableCard
              ref={index === 0 ? cardRef : null}
              profile={profile}
              onSwipeRight={() => handleSwipeRight(profile)}
              onSwipeLeft={() => handleSwipeLeft(profile)}
              onSwipeMove={(dx) => {
                if (index === 0) {
                  setSwipeOffset(dx);
                  // Animate button scale based on swipe
                  const absDx = Math.abs(dx);
                  // Always animate button scale when swiping
                  const scale = absDx > 10 ? 1 + Math.min(absDx / 100, 0.6) : 1;
                  Animated.spring(buttonScale, {
                    toValue: scale,
                    useNativeDriver: true,
                    tension: 150,
                    friction: 7,
                  }).start();
                }
              }}
              index={index}
            />
            {index === 0 && showLikeSticker && (
              <Animated.View
                style={[styles.sticker, styles.likeSticker, {opacity: likeStickerOpacity}]}>
                <Text style={styles.stickerText}>LIKE</Text>
              </Animated.View>
            )}
            {index === 0 && showDislikeSticker && (
              <Animated.View
                style={[
                  styles.sticker,
                  styles.dislikeSticker,
                  {opacity: dislikeStickerOpacity},
                ]}>
                <Text style={styles.stickerText}>NOPE</Text>
              </Animated.View>
            )}
          </View>
        );
      })}
      {currentProfile && (
        <View style={styles.actionButtons}>
          {/* Show buttons based on swipe state */}
          {Math.abs(swipeOffset) < 20 ? (
            // Normal state - show all buttons
            <>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.undoButton,
                  history.length === 0 && styles.disabledButton,
                ]}
                onPress={handleUndo}
                disabled={likeMutation.isLoading || dislikeMutation.isLoading || history.length === 0}>
                <Text style={styles.undoButtonIcon}>↶</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.dislikeButton]}
                onPress={handleDislikeButton}
                disabled={likeMutation.isLoading || dislikeMutation.isLoading}>
                <Text style={styles.actionButtonText}>✕</Text>
              </TouchableOpacity>
              <View style={[styles.actionButton, styles.disabledButton]} />
              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={handleLikeButton}
                disabled={likeMutation.isLoading || dislikeMutation.isLoading}>
                <Text style={styles.actionButtonText}>♥</Text>
              </TouchableOpacity>
              <View style={[styles.actionButton, styles.disabledButton]} />
            </>
          ) : swipeOffset > 20 ? (
            // Swiping right - show only like button (bigger)
            <Animated.View
              style={[
                styles.swipeButtonContainer,
                {
                  transform: [{scale: buttonScale}],
                },
              ]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton, styles.swipeButton]}
                onPress={handleLikeButton}
                disabled={likeMutation.isLoading || dislikeMutation.isLoading}>
                <Text style={[styles.actionButtonText, styles.swipeButtonText]}>♥</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            // Swiping left - show only dislike button (bigger)
            <Animated.View
              style={[
                styles.swipeButtonContainer,
                {
                  transform: [{scale: buttonScale}],
                },
              ]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.dislikeButton, styles.swipeButton]}
                onPress={handleDislikeButton}
                disabled={likeMutation.isLoading || dislikeMutation.isLoading}>
                <Text style={[styles.actionButtonText, styles.swipeButtonText]}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
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
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666',
    textAlign: 'center',
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
  sticker: {
    position: 'absolute',
    top: '30%',
    width: '80%',
    alignSelf: 'center',
    zIndex: 1000,
    borderWidth: 4,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '-15deg'}],
  },
  likeSticker: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderColor: '#4CAF50',
  },
  dislikeSticker: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderColor: '#F44336',
  },
  stickerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  actionButtons: {
    position: 'absolute',
    bottom: '2%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    zIndex: 1000,
    minHeight: 80,
  },
  swipeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 80,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  swipeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  dislikeButton: {
    backgroundColor: '#FF6B9D',
  },
  undoButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.3,
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  swipeButtonText: {
    fontSize: 40,
  },
  undoButtonIcon: {
    fontSize: 28,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default PeopleListScreen;

