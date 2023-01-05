import {
  Text,
  FlatList,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLink } from "expo-router";
import { useState } from "react";

import {
  AccountFragment,
  useGetAccountAppsQuery,
  useGetCurrentUserQuery,
} from "../generated/graphql";
import ListItem from "../components/ListItem";
import { spacing } from "@expo/styleguide-native";

const Home = () => {
  const link = useLink();
  const { data: userData } = useGetCurrentUserQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setSelectedAccount(data.viewer?.accounts[0]);
    },
  });

  const [selectedAccount, setSelectedAccount] = useState<AccountFragment>();
  const otherAccounts = userData?.viewer?.accounts?.filter(
    ({ id }) => selectedAccount?.id !== id
  );

  const { data, loading } = useGetAccountAppsQuery({
    variables: { accountId: selectedAccount?.id, offset: 0, limit: 30 },
    skip: !selectedAccount,
  });
  const apps = data?.account?.byId?.apps;

  return (
    <SafeAreaView style={styles.flex}>
      <Stack.Screen options={{ title: "EAS Prototype" }} />
      <View style={styles.accounts}>
        <Text>
          Current Account:{" "}
          <Text style={styles.highlightedText}>{selectedAccount?.name}</Text>
        </Text>
        <Text style={styles.changeAccount}>Change account:</Text>
        {otherAccounts?.map((account) => (
          <TouchableOpacity
            key={account.id}
            onPress={() => setSelectedAccount(account)}
          >
            <Text style={styles.accountText}>{account.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ListHeaderComponent={<Text>Projects</Text>}
        data={apps}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => link.push(`/projects/${item.id}`)}
            accessoryLeft={
              <Image
                source={{ uri: item.icon?.url }}
                style={styles.projectIcon}
              />
            }
          >
            <Text>{item.name}</Text>
          </ListItem>
        )}
        ListEmptyComponent={
          !data && loading ? <ActivityIndicator size="small" /> : null
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
});
