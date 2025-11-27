import React, {useRef, useImperativeHandle, forwardRef} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';
import ProfileCard from '../molecules/ProfileCard';
import {Profile} from '../../types';

interface SwipeableCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeMove?: (dx: number) => void;
  index: number;
}

export interface SwipeableCardRef {
  swipeRight: () => void;
  swipeLeft: () => void;
}

const SwipeableCardComponent = (
  {
    profile,
    onSwipeLeft,
    onSwipeRight,
    onSwipeMove,
    index,
  }: SwipeableCardProps,
  ref: React.Ref<SwipeableCardRef>,
) => {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const performSwipe = (direction: 'right' | 'left') => {
    const targetX = direction === 'right' ? 500 : -500;
    
    // Update swipe offset immediately for button feedback
    if (onSwipeMove && index === 0) {
      // Set initial offset
      onSwipeMove(targetX > 0 ? 30 : -30);
    }
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: {x: targetX, y: 0},
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (direction === 'right') {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      if (onSwipeMove && index === 0) {
        onSwipeMove(0);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    swipeRight: () => {
      if (index === 0) {
        performSwipe('right');
      }
    },
    swipeLeft: () => {
      if (index === 0) {
        performSwipe('left');
      }
    },
  }), [index]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({x: gestureState.dx, y: gestureState.dy});
        const opacityValue = 1 - Math.abs(gestureState.dx) / 200;
        opacity.setValue(Math.max(0, opacityValue));
        if (onSwipeMove && index === 0) {
          onSwipeMove(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 120;
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - like
          performSwipe('right');
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - dislike
          performSwipe('left');
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
          ]).start(() => {
            if (onSwipeMove && index === 0) {
              onSwipeMove(0);
            }
          });
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
      <ProfileCard profile={profile} showActions={true} fullScreen={true} />
    </Animated.View>
  );
};

const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>(SwipeableCardComponent);

SwipeableCard.displayName = 'SwipeableCard';

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export {SwipeableCard};
export default SwipeableCard;

