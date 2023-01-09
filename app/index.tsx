import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLink } from "expo-router";
import { spacing } from "@expo/styleguide-native";
import { Divider, Heading, View } from "expo-dev-client-components";

import { useGetAccountAppsQuery } from "../generated/graphql";
import ProjectsListItem from "../components/ProjectsListItem";
import UserAccountAvatar from "../components/UserAccountAvatar";
import { useUserAccount } from "../utils/UserAccountContext";

const Home = () => {
  const link = useLink();

  const { account: selectedAccount } = useUserAccount();
  const { data, loading } = useGetAccountAppsQuery({
    variables: { accountId: selectedAccount?.id, offset: 0, limit: 30 },
    skip: !selectedAccount,
  });

  const apps = data?.account?.byId?.apps;

  return (
    <SafeAreaView style={styles.flex}>
      <Stack.Screen
        options={{
          title: "EAS Prototype",
          headerRight: () => <UserAccountAvatar />,
        }}
      />
      <View padding="medium">
        <Heading
          color="secondary"
          size="small"
          style={styles.heading}
          type="InterSemiBold"
        >
          Projects
        </Heading>
        <FlatList
          data={apps}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item, index }) => (
            <ProjectsListItem
              onPress={() => link.push(`/projects/${item.id}`)}
              first={index === 0}
              last={index === apps?.length - 1}
              project={item}
            />
          )}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          ListEmptyComponent={
            !data && loading ? <ActivityIndicator size="small" /> : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  heading: {
    marginRight: spacing[2],
  },
  projectIcon: {
    height: 47,
    width: 47,
  },
  accounts: {
    padding: spacing[3],
  },
  highlightedText: {
    fontWeight: "600",
  },
  changeAccount: {
    marginTop: spacing[3],
  },
  accountText: {
    marginLeft: spacing[2],
    marginTop: spacing[0],
    color: "blue",
  },
  listContentContainer: {
    padding: spacing[2],
  },
  divider: {
    height: 1,
  },
});
