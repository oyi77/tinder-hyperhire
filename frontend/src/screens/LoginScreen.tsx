import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {useMutation} from 'react-query';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';
import {authService} from '../services/api';
import {userState, isAuthenticatedState} from '../store/authState';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const setUser = useSetRecoilState(userState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

  const loginMutation = useMutation(
    () => authService.login(email, password),
    {
      onSuccess: (data) => {
        setUser(data.user);
        setIsAuthenticated(true);
      },
      onError: (error: any) => {
        Alert.alert(
          'Login Failed',
          error?.response?.data?.message || 'Invalid credentials',
        );
      },
    },
  );

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    loginMutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text variant="h1" style={styles.title}>
            Tinder App
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Login to continue
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loginMutation.isLoading}
            style={styles.button}
          />

          <Text variant="caption" style={styles.hint}>
            Default: test@example.com / password123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#007AFF',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
  hint: {
    textAlign: 'center',
    marginTop: 16,
    color: '#999',
  },
});

export default LoginScreen;

