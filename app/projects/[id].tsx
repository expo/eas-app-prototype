import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { spacing } from "@expo/styleguide-native";
import * as Device from "expo-device";

import { useGetAppBuildsQuery } from "../../generated/graphql";
import BuildsListItem from "../../components/BuildsListItem";
import { Divider, Heading, View } from "expo-dev-client-components";

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
      {data ? (
        <FlatList
          data={builds}
          ListHeaderComponent={
            <Heading
              color="secondary"
              size="large"
              style={{ marginRight: spacing[2] }}
              type="InterSemiBold"
            >
              Builds
            </Heading>
          }
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item, index }) => (
            <BuildsListItem
              build={item}
              first={index === 0}
              last={index === builds?.length - 1}
            />
          )}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
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
    padding: spacing[2],
  },
  divider: {
    height: 1,
  },
});
