import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRecoilValue} from 'recoil';
import {Text, View, StyleSheet} from 'react-native';
import PeopleListScreen from '../screens/PeopleListScreen';
import LikedPeopleScreen from '../screens/LikedPeopleScreen';
import LoginScreen from '../screens/LoginScreen';
import {isAuthenticatedState} from '../store/authState';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simple icon components
const DiscoverIcon = ({focused}: {focused: boolean}) => (
  <Text style={[styles.icon, focused && styles.iconActive]}>🔥</Text>
);

const LikedIcon = ({focused}: {focused: boolean}) => (
  <Text style={[styles.icon, focused && styles.iconActive]}>❤️</Text>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="PeopleList"
        component={PeopleListScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({focused}) => <DiscoverIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="LikedPeople"
        component={LikedPeopleScreen}
        options={{
          title: 'Liked',
          tabBarIcon: ({focused}) => <LikedIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  iconActive: {
    opacity: 1,
  },
});

export default AppNavigator;

