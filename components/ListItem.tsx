import { spacing } from '@expo/styleguide-native';
import { View } from 'expo-dev-client-components';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  accessoryLeft?: React.ReactNode;
  accessoryRight?: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
  first?: boolean;
  last?: boolean;
}

const ListItem = ({ accessoryLeft, accessoryRight, children, onPress, first, last }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View
        border="default"
        overflow="hidden"
        bg="default"
        padding="medium"
        roundedTop={first ? 'large' : undefined}
        roundedBottom={last ? 'large' : undefined}
        style={[
          styles.item,
          {
            borderBottomWidth: last ? 1 : 0,
            borderTopWidth: first ? 1 : 0,
          },
        ]}>
        {accessoryLeft ? <View style={styles.accessoryLeft}>{accessoryLeft}</View> : null}
        <View style={styles.flex}>{children}</View>
        {accessoryRight ? <View style={styles.accessoryRight}>{accessoryRight}</View> : null}
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessoryLeft: {
    marginRight: spacing[2],
  },
  accessoryRight: {
    marginLeft: spacing[2],
  },
  flex: {
    flex: 1,
  },
});
