import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import Text from '../atoms/Text';
import {Profile} from '../../types';

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  showActions = false,
}) => {
  const images = profile.pictures || [];
  const currentImage = images[0] || '';

  return (
    <View style={styles.container}>
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
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  info: {
    flexDirection: 'column',
  },
  name: {
    color: '#fff',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  location: {
    color: '#fff',
  },
});

export default ProfileCard;
