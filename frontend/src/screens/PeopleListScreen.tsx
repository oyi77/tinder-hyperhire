import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useInfiniteQuery, useMutation, useQueryClient} from 'react-query';
import SwipeableCard from '../components/organisms/SwipeableCard';
import Text from '../components/atoms/Text';
import {peopleService} from '../services/api';
import {Profile} from '../types';

const {width, height} = Dimensions.get('window');

const PeopleListScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    },
  );

  const likeMutation = useMutation(peopleService.like, {
    onSuccess: (data) => {
      if (data.match) {
        Alert.alert('It\'s a match!', 'You both liked each other!');
      }
      handleNext();
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to like profile');
    },
  });

  const dislikeMutation = useMutation(peopleService.dislike, {
    onSuccess: () => {
      handleNext();
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to dislike profile');
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
    likeMutation.mutate(profile.id);
  };

  const handleSwipeLeft = (profile: Profile) => {
    dislikeMutation.mutate(profile.id);
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
      {visibleProfiles.map((profile, index) => (
        <SwipeableCard
          key={profile.id}
          profile={profile}
          onSwipeRight={() => handleSwipeRight(profile)}
          onSwipeLeft={() => handleSwipeLeft(profile)}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
});

export default PeopleListScreen;

