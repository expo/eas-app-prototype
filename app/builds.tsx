import { View, Text } from "react-native";

export default function Builds({ navigation }) {
  return (
    <View>
      <Text
        onPress={() => {
          // Go back to the previous screen using the imperative API.
          navigation.goBack();
        }}
      >
        Builds list
      </Text>
    </View>
  );
}
