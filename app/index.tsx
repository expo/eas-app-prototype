import { View } from "react-native";
import { Link, Stack } from "expo-router";

const Login = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Login" }} />
      <Link href="/builds">Go to builds</Link>
    </View>
  );
};

export default Login;
