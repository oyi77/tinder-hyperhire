import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import Text from '../atoms/Text';
import {Profile} from '../../types';

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  fullScreen?: boolean;
}

const {width, height} = Dimensions.get('window');

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  showActions = false,
  fullScreen = false,
}) => {
  // Normalize pictures to always be an array
  const normalizePictures = (pictures: any): string[] => {
    if (!pictures) return [];
    if (Array.isArray(pictures)) return pictures;
    if (typeof pictures === 'string') {
      try {
        const parsed = JSON.parse(pictures);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const images = normalizePictures(profile.pictures);
  const currentImage = images[0] || '';

  const cardStyle = fullScreen
    ? [styles.container, styles.fullScreenContainer]
    : styles.container;

  return (
    <View style={cardStyle}>
      <Image
        source={{uri: currentImage}}
        style={styles.image}
        resizeMode="cover"
        onError={() => {
          // Handle image load error silently
        }}
      />
      {images.length > 1 && (
        <View style={styles.imageIndicators}>
          {images.slice(0, 5).map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === 0 && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
      <View style={styles.overlay}>
        {/* Multiple gradient layers for smooth fade */}
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
        <View style={styles.info}>
          <Text variant="h2" style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          {profile.location && (
            <Text variant="caption" style={styles.location}>
              {profile.location}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: (width - 40) * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fullScreenContainer: {
    width: width,
    height: height * 0.9,
    borderRadius: 20,
    margin: 0,
    marginTop: -80,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 120,
    zIndex: 1,
    height: 200,
  },
  gradientLayer1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  gradientLayer2: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gradientLayer3: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  info: {
    flexDirection: 'column',
    zIndex: 2,
  },
  name: {
    color: '#fff',
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  location: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
});

export default ProfileCard;
