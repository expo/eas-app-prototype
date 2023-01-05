import {
  Text,
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";

import { useGetAppBuildsQuery } from "../../generated/graphql";
import ListItem from "../../components/ListItem";

const Project = ({ route }) => {
  const { id } = route.params;

  const { data } = useGetAppBuildsQuery({
    variables: { appId: id, limit: 30, offset: 0 },
  });

  const app = data?.app?.byId;
  const builds = app?.builds;

  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: app?.name || "" }} />
      <Text>Builds</Text>
      {data ? (
        <FlatList
          data={builds}
          renderItem={({ item }) => (
            <ListItem>
              <Text>{item.id}</Text>
            </ListItem>
          )}
        />
      ) : (
        <ActivityIndicator size="small" />
      )}
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
