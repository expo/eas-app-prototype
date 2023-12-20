import {
  SectionList,
  StyleSheet,
  SectionListData,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { spacing } from '@expo/styleguide-native';
import { Divider, Heading, View } from 'expo-dev-client-components';

import {
  BuildForBuildsListItemFragment,
  ProjectForProjectsListItemFragment,
  useGetAccountAppsAndBuildsQuery,
  useGetCurrentUserQuery,
} from '../../generated/graphql';
import ProjectsListItem from '../../components/ProjectsListItem';
import UserAccountAvatar from '../../components/UserAccountAvatar';
import { useUserAccount } from '../../utils/UserAccountContext';
import BuildsListItem from '../../components/BuildsListItem';
import { useMemo, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useThrottle } from '../../hooks/useThrottle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAGE_LIMIT = 15;

const Home = () => {
  const insets = useSafeAreaInsets();

  const { account: selectedAccount, setAccount } = useUserAccount();

  useGetCurrentUserQuery({
    nextFetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.viewer?.accounts?.[0]) {
        setAccount(data.viewer.accounts[0]);
      }
    },
    skip: Boolean(selectedAccount),
  });

  const { data, loading, fetchMore, refetch, networkStatus } = useGetAccountAppsAndBuildsQuery({
    variables: { accountId: selectedAccount?.id, offset: 0, limit: PAGE_LIMIT },
    notifyOnNetworkStatusChange: true,
    skip: !selectedAccount,
  });
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const refetching = useThrottle(networkStatus === NetworkStatus.refetch, 800);
  const fetchingMore = useThrottle(networkStatus === NetworkStatus.fetchMore, 800);

  const apps = data?.account?.byId?.apps;
  const builds = data?.account?.byId?.builds;

  const sections = useMemo(() => {
    let res: SectionListData<
      ProjectForProjectsListItemFragment | BuildForBuildsListItemFragment
    >[] = [];

    if (builds?.length) {
      res.push({ data: builds || [], key: 'Recent builds' });
    }

    if (apps?.length) {
      res.push({ data: apps, key: 'Projects' });
    }

    return res;
  }, [apps, builds]);

  const onEndReached = async () => {
    if (loading || !hasMoreResults) {
      return;
    }

    const { data: fetchMoreData } = await fetchMore({
      variables: { offset: apps.length },
    });

    setHasMoreResults(fetchMoreData.account?.byId?.apps?.length === PAGE_LIMIT);
  };

  const refresh = async () => {
    setHasMoreResults(true);
    await refetch();
  };

  return (
    <View flex="1">
      <Stack.Screen
        options={{
          title: 'EAS Prototype',
          headerRight: () => <UserAccountAvatar />,
        }}
      />
      <SectionList
        sections={sections}
        renderItem={({ item, index, section }) =>
          item.__typename === 'App' ? (
            <ProjectsListItem
              onPress={() => router.push(`/projects/${item.id}`)}
              first={index === 0}
              last={index === section.data?.length - 1}
              project={item}
            />
          ) : (
            <BuildsListItem
              first={index === 0}
              last={index === section.data?.length - 1}
              build={item}
              showProjectName
            />
          )
        }
        onEndReached={onEndReached}
        refreshControl={<RefreshControl refreshing={refetching} onRefresh={refresh} />}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        contentContainerStyle={[
          styles.listContentContainer,
          sections?.length === 0 && loading && styles.loadingList,
          { paddingBottom: insets.bottom + spacing[4] },
        ]}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Heading color="secondary" size="small" style={styles.heading} type="InterSemiBold">
            {section.key}
          </Heading>
        )}
        ListFooterComponent={
          fetchingMore ? (
            <View padding="medium">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View padding="medium" flex="1" align="centered">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  heading: {
    marginRight: spacing[2],
    marginVertical: spacing[2],
  },
  listContentContainer: {
    paddingHorizontal: spacing[4],
  },
  loadingList: {
    flexGrow: 1,
  },
  divider: {
    height: 1,
  },
});
