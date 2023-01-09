import { spacing } from '@expo/styleguide-native';
import { useExpoTheme, Text, CheckIcon, Row, ExpoTheme } from 'expo-dev-client-components';
import { StyleProp, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';

type Theme = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'error';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  theme?: Theme;
};

function getThemeColors(
  theme: Theme,
  expoTheme: ExpoTheme
): {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: 1;
  color: string;
} {
  switch (theme) {
    case 'primary':
      return {
        backgroundColor: expoTheme.button.primary.background,
        color: expoTheme.button.primary.foreground,
      };
    case 'secondary':
      return {
        backgroundColor: expoTheme.button.secondary.background,
        color: expoTheme.button.secondary.foreground,
      };
    case 'tertiary':
      return {
        backgroundColor: expoTheme.button.tertiary.background,
        color: expoTheme.button.tertiary.foreground,
      };
    case 'ghost':
      return {
        backgroundColor: expoTheme.button.ghost.background,
        color: expoTheme.button.ghost.foreground,
        borderColor: expoTheme.button.ghost.border,
        borderWidth: 1,
      };
    case 'error':
      return {
        backgroundColor: expoTheme.background.error,
        color: expoTheme.text.error,
        borderColor: expoTheme.border.error,
        borderWidth: 1,
      };
  }
}

const Chip = ({ label, onPress, selected, style, theme = 'primary' }: Props) => {
  const expoTheme = useExpoTheme();

  const { backgroundColor, borderColor, color } = getThemeColors(theme, expoTheme);

  return (
    <TouchableOpacity onPress={onPress}>
      <Row
        rounded="full"
        px="tiny"
        align="center"
        style={[
          styles.chip,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          },
          style,
        ]}>
        {selected && <CheckIcon style={{ tintColor: color }} />}
        <Text
          size="small"
          type={selected ? 'InterBold' : 'InterSemiBold'}
          style={{ color, marginHorizontal: spacing['1.5'] }}>
          {label}
        </Text>
      </Row>
    </TouchableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    minHeight: 30,
  },
});
