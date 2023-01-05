import { borderRadius, spacing } from "@expo/styleguide-native";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../utils/theme";

interface Props {
  accessoryLeft?: React.ReactNode;
  accessoryRight?: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
}

const ListItem = ({
  accessoryLeft,
  accessoryRight,
  children,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={styles.item}>
        {accessoryLeft ? (
          <View style={styles.accessoryLeft}>{accessoryLeft}</View>
        ) : null}
        <View style={styles.flex}>{children}</View>
        {accessoryRight ? <View>{accessoryRight}</View> : null}
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  item: {
    padding: spacing[3],
    marginVertical: spacing[1],
    backgroundColor: theme.background.default,
    borderRadius: borderRadius.lg,
    borderColor: theme.border.default,
    borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  accessoryLeft: {
    marginRight: spacing["1.5"],
  },
  accessoryRight: {
    marginLeft: spacing["1.5"],
  },
  flex: {
    flex: 1,
  },
});
