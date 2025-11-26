import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRecoilValue} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PeopleListScreen from '../screens/PeopleListScreen';
import LikedPeopleScreen from '../screens/LikedPeopleScreen';
import LoginScreen from '../screens/LoginScreen';
import {isAuthenticatedState} from '../store/authState';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tab.Screen
        name="PeopleList"
        component={PeopleListScreen}
        options={{title: 'Discover'}}
      />
      <Tab.Screen
        name="LikedPeople"
        component={LikedPeopleScreen}
        options={{title: 'Liked'}}
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

export default AppNavigator;

