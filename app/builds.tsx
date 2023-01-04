import { View, Text, StyleSheet } from "react-native";
import { useGetCurrentUserQuery } from "../generated/graphql";

const Builds = () => {
  const { data } = useGetCurrentUserQuery({
    fetchPolicy: "cache-and-network",
  });

  return (
    <View style={styles.container}>
      {data ? (
        <Text
          style={styles.title}
        >{`Welcome ${data?.viewer?.firstName},`}</Text>
      ) : null}
    </View>
  );
};

export default Builds;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
  },
});
