import { useEffect, useState } from 'react';
import { Platform, AppState, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import { View, Text } from 'expo-dev-client-components';
import React from 'react';
import { startActivityAsync } from 'expo-intent-launcher';
import { Button } from './Button';
import { spacing } from '@expo/styleguide-native';

const SideLoadingChecker = () => {
  const [isSideLoadingEnabled, setIsSideLoadingEnabled] = useState<boolean>();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const checkSideLoading = () => Device.isSideLoadingEnabledAsync().then(setIsSideLoadingEnabled);

    checkSideLoading();
    const listener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkSideLoading();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  const openSettings = () => {
    startActivityAsync('android.settings.MANAGE_UNKNOWN_APP_SOURCES', {
      data: 'package:com.gabrieldonadel.easappprototype',
    });
  };

  if (Platform.OS !== 'android' || isSideLoadingEnabled) {
    return;
  }

  return (
    <View
      padding="medium"
      rounded="medium"
      margin="medium"
      border="default"
      bg="default"
      style={{ alignItems: 'flex-start' }}>
      <Text type="InterSemiBold">
        In order to install apps you should enable side loading, for that access app settings and
        select "Allow from this source".
      </Text>
      <Button style={styles.button} label="Access Settings" onPress={openSettings} />
    </View>
  );
};

export default React.memo(SideLoadingChecker);

const styles = StyleSheet.create({
  button: {
    marginTop: spacing[4],
  },
});
