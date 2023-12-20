import { iconSize, UsersIcon } from '@expo/styleguide-native';
import { Button, View, Image, useExpoTheme } from 'expo-dev-client-components';
import { router } from 'expo-router';
import * as React from 'react';
import { useUserAccount } from '../utils/UserAccountContext';

const UserAccountAvatar = () => {
  const theme = useExpoTheme();

  const { account } = useUserAccount();

  return (
    <Button.Container onPress={() => router.push('/account')}>
      {account?.owner?.profilePhoto ? (
        <Image size="xl" rounded="full" source={{ uri: account.owner.profilePhoto }} />
      ) : (
        <View rounded="full" height="xl" width="xl" bg="secondary" align="centered">
          <UsersIcon color={theme.icon.default} size={iconSize.sm} />
        </View>
      )}
    </Button.Container>
  );
};

export default UserAccountAvatar;
