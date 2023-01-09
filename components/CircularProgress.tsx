import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { lightTheme } from '@expo/styleguide-native';

interface Props {
  size?: number;
  percentage?: number;
}

const CircularProgress = ({ size = 45, percentage = 0 }: Props) => {
  const circumference = size * Math.PI * 2;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg height={size} width={size} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={size}
          stroke={lightTheme.icon.quaternary}
          strokeWidth={size / 3}
          strokeDasharray={circumference}
        />
        <Circle
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          cx="50"
          cy="50"
          r={size}
          stroke={lightTheme.icon.secondary}
          strokeWidth={size / 3}
          strokeDasharray={circumference}
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;
