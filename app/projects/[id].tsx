import {
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { spacing } from "@expo/styleguide-native";
import * as Device from "expo-device";

import { useGetAppBuildsQuery } from "../../generated/graphql";
import BuildsListItem from "../../components/BuildsListItem";
import { Divider, Heading, View } from "expo-dev-client-components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListItem from "../../components/ListItem";

const PAGE_LIMIT = 15;

const Project = ({ route }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const { data, loading, fetchMore } = useGetAppBuildsQuery({
    fetchPolicy: "cache-and-network",
    variables: { appId: id, limit: PAGE_LIMIT, offset: 0 },
  });
  const [hasMoreResults, setHasMoreResults] = useState(true);

  const app = data?.app?.byId;
  const builds = app?.builds;

  useEffect(() => {
    if (Platform.OS === "android") {
      Device.isSideLoadingEnabledAsync().then((value) => {
        // TODO: If not enabled show "Install unknown apps" permission
        console.log("Is side loading enabled? ", value);
      });
    }
  }, []);

  const onEndReached = async () => {
    if (loading || !hasMoreResults) {
      return;
    }

    const { data: fetchMoreData } = await fetchMore({
      variables: { offset: builds.length },
    });

    setHasMoreResults(fetchMoreData.app?.byId?.builds?.length === PAGE_LIMIT);
  };

  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: app?.name || "" }} />
      <FlatList
        data={builds}
        onEndReached={onEndReached}
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
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + spacing[4] },
        ]}
        renderItem={({ item, index }) => (
          <BuildsListItem
            build={item}
            first={index === 0}
            last={!hasMoreResults && index === builds?.length - 1}
          />
        )}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        ListFooterComponent={
          hasMoreResults && (
            <>
              {builds?.length ? <Divider style={styles.divider} /> : null}
              <ListItem first={!builds?.length} last>
                <ActivityIndicator size="small" />
              </ListItem>
            </>
          )
        }
      />
    </View>
  );
};

export default Project;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
  },
  divider: {
    height: 1,
  },
});
