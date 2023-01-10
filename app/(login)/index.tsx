import { spacing } from '@expo/styleguide-native';
import { Heading, TextInput, useExpoTheme, View } from 'expo-dev-client-components';
import { useState } from 'react';

import { Button } from '../../components/Button';
import { useUserAccount } from '../../utils/UserAccountContext';

const Login = () => {
  const { setSessionSecret } = useUserAccount();
  const theme = useExpoTheme();

  const [secret, setSecret] = useState('');

  return (
    <View padding="medium">
      <Heading color="secondary" size="small" type="InterSemiBold">
        Session Secret
      </Heading>
      <TextInput
        border="default"
        rounded="large"
        padding="small"
        placeholder=" Session Secret"
        onChangeText={setSecret}
        style={{ marginVertical: spacing[4], backgroundColor: theme.background.default }}
      />
      <Button
        label="Login"
        disabled={!secret.trim()}
        onPress={() => setSessionSecret(secret.trim())}
      />
    </View>
  );
};

export default Login;
