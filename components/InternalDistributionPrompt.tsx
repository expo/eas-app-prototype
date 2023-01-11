import { View } from 'expo-dev-client-components';
import { Linking, Platform, Text } from 'react-native';
import { Button } from './Button';
import SectionHeader from './SectionHeader';

const InternalDistributionPrompt = () => {
  if (Platform.OS === 'android') {
    return null;
  }

  const onPress = () => {
    /*
     const appleDeviceRegistrationRequest =
    await AppleDeviceRegistrationRequestMutation.createAppleDeviceRegistrationRequestAsync(
      graphqlClient,
      appleTeam.id,
      accountId
    );
    */
  };

  // https://expo.dev/register-device/4b2e83a8-7478-46f1-9430-2f9b3ef5fa4f

  return (
    <View>
      <SectionHeader header="Set up device for internal distribution" />
      <Button
        label="Register device"
        onPress={() => {
          Linking.openURL(
            'https://apple-profile.expo.dev/v2/udid/profile?request-id=4b2e83a8-7478-46f1-9430-2f9b3ef5fa4f'
          );
        }}
        style={{
          alignItems: 'center',
        }}
      />
    </View>
  );
};

export default InternalDistributionPrompt;
