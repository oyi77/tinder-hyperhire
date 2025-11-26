import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import ProfileCard from '../components/molecules/ProfileCard';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import {peopleService} from '../services/api';
import {Profile} from '../types';

const LikedPeopleScreen: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: likedProfiles,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery('liked-people', peopleService.getLiked);

  const undoLikeMutation = useMutation(peopleService.undoLike, {
    onSuccess: () => {
      queryClient.invalidateQueries('liked-people');
      queryClient.invalidateQueries('recommended-people');
      Alert.alert('Success', 'Like undone successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to undo like');
    },
  });

  const handleUndoLike = (profileId: number) => {
    Alert.alert(
      'Undo Like',
      'Are you sure you want to undo this like?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Undo',
          style: 'destructive',
          onPress: () => undoLikeMutation.mutate(profileId),
        },
      ],
    );
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

  return (
    <View style={styles.container}>
      <FlatList
        data={likedProfiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <ProfileCard profile={item} showActions={false} />
            <View style={styles.buttonContainer}>
              <Button
                title="Undo Like"
                variant="danger"
                onPress={() => handleUndoLike(item.id)}
                loading={undoLikeMutation.isLoading}
              />
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContent: {
    padding: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default LikedPeopleScreen;

