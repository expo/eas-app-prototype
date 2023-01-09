import { spacing } from '@expo/styleguide-native';
import { Heading, Row } from 'expo-dev-client-components';
import * as React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

type Props = {
  header: string;
  style?: StyleProp<ViewStyle>;
};

const SectionHeader = ({ header, style }: Props) => {
  return (
    <Row px="small" py="small" align="center" style={style}>
      <Heading color="secondary" size="small" style={styles.heading} type="InterSemiBold">
        {header}
      </Heading>
    </Row>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  heading: {
    marginRight: spacing[2],
  },
});
