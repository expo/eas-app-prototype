import { FlatList, ActivityIndicator, StyleSheet, RefreshControl, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { spacing } from '@expo/styleguide-native';
import { Divider, Heading, View, Row, Text } from 'expo-dev-client-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NetworkStatus } from '@apollo/client';

import { AppPlatform, useGetAppBuildsQuery } from '../../generated/graphql';
import BuildsListItem from '../../components/BuildsListItem';
import ListItem from '../../components/ListItem';
import SideLoadingChecker from '../../components/SideLoadingChecker';
import { useThrottle } from '../../hooks/useThrottle';
import { useResettableState } from '../../hooks/useResettableState';
import Chip from '../../components/Chip';

const PAGE_LIMIT = 15;

const Project = ({ route }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const [selectedPlatform, setSelectedPlatform] = useState<AppPlatform>(
    Platform.OS.toUpperCase() as AppPlatform
  );

  const variables = useMemo(
    () => ({
      appId: id,
      limit: PAGE_LIMIT,
      offset: 0,
      platform: selectedPlatform,
    }),
    [id, selectedPlatform]
  );

  const { data, loading, fetchMore, networkStatus, refetch } = useGetAppBuildsQuery({
    fetchPolicy: 'cache-and-network',
    variables,
    notifyOnNetworkStatusChange: true,
  });
  const [hasMoreResults, setHasMoreResults] = useResettableState(true, variables);

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
          <>
            <Heading color="secondary" size="large" style={styles.heading} type="InterSemiBold">
              Builds
            </Heading>
            <Row align="start" mb="medium">
              <Chip
                style={styles.chip}
                onPress={() => setSelectedPlatform(null)}
                label="All"
                selected={selectedPlatform === null}
              />
              <Chip
                style={styles.chip}
                onPress={() => setSelectedPlatform(AppPlatform.Android)}
                label="Android"
                selected={selectedPlatform === AppPlatform.Android}
              />
              <Chip
                style={styles.chip}
                onPress={() => setSelectedPlatform(AppPlatform.Ios)}
                label="iOS"
                selected={selectedPlatform === AppPlatform.Ios}
              />
            </Row>
          </>
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
        ListEmptyComponent={
          !loading && (
            <View bg="default" padding="medium" rounded="large" border="default">
              <Text>No builds found</Text>
            </View>
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
  chip: {
    marginRight: spacing[2],
  },
});
