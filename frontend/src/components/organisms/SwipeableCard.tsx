import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';
import ProfileCard from '../molecules/ProfileCard';
import {Profile} from '../../types';

interface SwipeableCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  index: number;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  index,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({x: gestureState.dx, y: gestureState.dy});
        const opacityValue = 1 - Math.abs(gestureState.dx) / 200;
        opacity.setValue(Math.max(0, opacityValue));
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 120;
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - like
          Animated.parallel([
            Animated.timing(position, {
              toValue: {x: 500, y: gestureState.dy},
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onSwipeRight();
          });
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - dislike
          Animated.parallel([
            Animated.timing(position, {
              toValue: {x: -500, y: gestureState.dy},
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onSwipeLeft();
          });
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(position, {
              toValue: {x: 0, y: 0},
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [
            {translateX: position.x},
            {translateY: position.y},
            {rotate},
          ],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}>
      <ProfileCard profile={profile} showActions={true} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default SwipeableCard;

