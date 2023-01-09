import { iconSize, spacing, UsersIcon } from "@expo/styleguide-native";
import {
  View,
  Text,
  Row,
  useExpoTheme,
  CheckIcon,
  Spacer,
  Image,
} from "expo-dev-client-components";
import { TouchableOpacity } from "react-native";

import { AccountFragment } from "../generated/graphql";

interface Props {
  account: AccountFragment;
  selected?: boolean;
  first?: boolean;
  last?: boolean;
  onPress?: () => void;
}

const AccountsListItem = ({
  account,
  first,
  last,
  onPress,
  selected,
}: Props) => {
  const theme = useExpoTheme();

  return (
    <TouchableOpacity key={account.id} onPress={onPress}>
      <Row
        justify="between"
        padding="medium"
        align="center"
        bg="default"
        border="default"
        roundedTop={first ? "large" : undefined}
        roundedBottom={last ? "large" : undefined}
        style={{
          borderBottomWidth: last ? 1 : 0,
          borderTopWidth: first ? 1 : 0,
        }}
      >
        <Row flex="1" align={!account.owner?.fullName ? "center" : "start"}>
          {account?.owner?.profilePhoto ? (
            <Image
              size="xl"
              rounded="full"
              source={{ uri: account.owner.profilePhoto }}
            />
          ) : (
            <View
              rounded="full"
              height="xl"
              width="xl"
              bg="secondary"
              align="centered"
            >
              <UsersIcon color={theme.icon.default} size={iconSize.sm} />
            </View>
          )}
          <Spacer.Horizontal size="small" />
          <View flex="1">
            {account.owner ? (
              <>
                {account.owner.fullName ? (
                  <>
                    <Text
                      type="InterBold"
                      style={{ paddingRight: spacing[4] }}
                      numberOfLines={1}
                    >
                      {account.owner.fullName}
                    </Text>
                    <Spacer.Vertical size="tiny" />
                    <Text
                      style={{ paddingRight: spacing[4] }}
                      color="secondary"
                      type="InterRegular"
                      numberOfLines={1}
                      size="small"
                    >
                      {account.owner.username}
                    </Text>
                  </>
                ) : (
                  <Text
                    type="InterBold"
                    style={{ paddingRight: spacing[4] }}
                    numberOfLines={1}
                  >
                    {account.owner.username}
                  </Text>
                )}
              </>
            ) : (
              <Text
                type="InterBold"
                style={{ paddingRight: spacing[4] }}
                numberOfLines={1}
              >
                {account.name}
              </Text>
            )}
          </View>
        </Row>
        {selected && <CheckIcon />}
      </Row>
    </TouchableOpacity>
  );
};

export default AccountsListItem;
