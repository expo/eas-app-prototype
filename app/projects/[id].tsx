import {
  Text,
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { spacing } from "@expo/styleguide-native";
import * as Device from "expo-device";

import { useGetAppBuildsQuery } from "../../generated/graphql";
import BuildsListItem from "../../components/BuildsListItem";

const Project = ({ route }) => {
  const { id } = route.params;

  const { data } = useGetAppBuildsQuery({
    variables: { appId: id, limit: 30, offset: 0 },
  });

  const app = data?.app?.byId;
  const builds = app?.builds;

  useEffect(() => {
    Device.isSideLoadingEnabledAsync().then((value) => {
      // TODO: If not enabled show "Install unknown apps" permission
      console.log("Is side loading enabled? ", value);
    });
  }, []);

  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: app?.name || "" }} />
      <Text>Builds</Text>
      {data ? (
        <FlatList
          data={builds}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => <BuildsListItem build={item} />}
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
  contentContainer: {
    paddingHorizontal: spacing[1],
  },
});
