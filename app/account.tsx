import { useLink } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Row, XIcon, useExpoTheme, Divider, Spacer } from 'expo-dev-client-components';
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { borderRadius, spacing } from '@expo/styleguide-native';

import SectionHeader from '../components/SectionHeader';
import { useGetCurrentUserQuery } from '../generated/graphql';
import AccountsListItem from '../components/AccountsListItem';
import { useUserAccount } from '../utils/UserAccountContext';

const BUTTON_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const AccountModal = ({ navigation }) => {
  const theme = useExpoTheme();
  const link = useLink();

  const { account: selectedAccount, setAccount } = useUserAccount();
  const { data } = useGetCurrentUserQuery({
    fetchPolicy: 'cache-and-network',
  });

  const accounts = data?.viewer?.accounts;

  return (
    <View flex="1">
      <StatusBar style="light" />
      <Row justify="between" align="center">
        <View padding="medium">
          <Text type="InterBold">Account</Text>
        </View>
        <Row>
          <TouchableOpacity
            onPress={() => link.push('../')}
            hitSlop={BUTTON_HIT_SLOP}
            style={styles.xButton}>
            <XIcon />
          </TouchableOpacity>
        </Row>
      </Row>
      <View flex="1">
        <FlatList
          data={accounts}
          renderItem={({ item, index }) => (
            <AccountsListItem
              account={item}
              first={index === 0}
              last={index === accounts?.length - 1}
              selected={item.id === selectedAccount?.id}
              onPress={() => {
                setAccount(item);
                navigation.goBack();
              }}
            />
          )}
          contentContainerStyle={styles.flatListContentContainer}
          ListHeaderComponent={
            <SectionHeader header="Switch Account" style={styles.noPaddingTop} />
          }
          ListFooterComponent={
            <>
              <Spacer.Vertical size="large" />
              <SectionHeader header="Log Out" style={styles.noPaddingTop} />
              <TouchableOpacity
                onPress={() => {
                  // TODO: Implement logout logic
                  setAccount(null);
                }}
                style={{
                  backgroundColor: theme.button.tertiary.background,
                  padding: spacing[3],
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: borderRadius.md,
                }}>
                <Text style={{ color: theme.button.tertiary.foreground }} type="InterSemiBold">
                  Log Out
                </Text>
              </TouchableOpacity>
            </>
          }
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        />
      </View>
    </View>
  );
};

export default AccountModal;

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
  noPaddingTop: {
    paddingTop: 0,
  },
  xButton: {
    padding: spacing[2],
    borderRadius: 24,
    marginRight: spacing[2],
  },
  flatListContentContainer: {
    padding: spacing[4],
  },
});
