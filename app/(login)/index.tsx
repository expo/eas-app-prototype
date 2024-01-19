import { spacing } from '@expo/styleguide-native';
import { View, Text } from 'expo-dev-client-components';
import * as WebBrowser from 'expo-web-browser';

import { Button } from '../../components/Button';
import { useUserAccount } from '../../utils/UserAccountContext';

const Login = () => {
  const { setSessionSecret } = useUserAccount();

  const promptLogin = async (type: 'login' | 'signup') => {
    const redirectBase = 'exp+eas-app-prototype://auth';
    const authSessionURL = `https://expo.dev/${type}?confirm_account=1&app_redirect_uri=${encodeURIComponent(
      redirectBase
    )}`;
    const result = await WebBrowser.openAuthSessionAsync(authSessionURL, redirectBase, {
      showInRecents: true,
    });

    if (result.type === 'success') {
      const resultURL = new URL(result.url);
      const sessionSecret = resultURL.searchParams.get('session_secret');
      if (!sessionSecret) {
        throw new Error('session_secret is missing in auth redirect query');
      }

      setSessionSecret(sessionSecret);
    }
  };

  return (
    <View padding="medium">
      <Text color="secondary" type="InterMedium">
        Log in or create an account to access your projects, download builds, and more.
      </Text>

      <View mt="5" style={{ gap: spacing['1.5'], alignItems: 'flex-start' }}>
        <Button label="Log In" onPress={() => promptLogin('login')} />
        <Button label="Sign Up" onPress={() => promptLogin('signup')} theme="tertiary" />
      </View>
    </View>
  );
};

export default Login;
