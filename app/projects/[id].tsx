import { FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { spacing } from '@expo/styleguide-native';

import { useGetAppBuildsQuery } from '../../generated/graphql';
import BuildsListItem from '../../components/BuildsListItem';
import { Divider, Heading, View } from 'expo-dev-client-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListItem from '../../components/ListItem';
import SideLoadingChecker from '../../components/SideLoadingChecker';
import { useThrottle } from '../../hooks/useThrottle';
import { NetworkStatus } from '@apollo/client';

const PAGE_LIMIT = 15;

const Project = ({ route }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const { data, loading, fetchMore, networkStatus, refetch } = useGetAppBuildsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      appId: id,
      limit: PAGE_LIMIT,
      offset: 0,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [hasMoreResults, setHasMoreResults] = useState(true);

  const app = data?.app?.byId;
  const builds = app?.builds;

  const onEndReached = async () => {
    if (loading || !hasMoreResults) {
      return;
    }

    const { data: fetchMoreData } = await fetchMore({
      variables: { offset: builds.length },
    });

    setHasMoreResults(fetchMoreData.app?.byId?.builds?.length === PAGE_LIMIT);
  };

  const refetching = useThrottle(networkStatus === NetworkStatus.refetch, 800);

  const refresh = async () => {
    setHasMoreResults(true);
    await refetch();
  };

  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: app?.name || '' }} />
      <SideLoadingChecker />
      <FlatList
        data={builds}
        onEndReached={onEndReached}
        ListHeaderComponent={
          <Heading color="secondary" size="large" style={styles.heading} type="InterSemiBold">
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
            last={!loading && index === builds?.length - 1}
          />
        )}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        refreshControl={<RefreshControl refreshing={refetching} onRefresh={refresh} />}
        ListFooterComponent={
          loading && (
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
  heading: {
    marginBottom: spacing[2],
  },
});
