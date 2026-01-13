import React, { useRef } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';

interface ButtonProps {
  title: string;
  onPress?: () => void;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
   const theme = useTheme();
    const appstyles = AppStyles(theme);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      onPress?.();
    });
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5], // slightly deeper press
  });

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <AnimatedGradient
          colors={[theme.colors.primary, theme.colors.primaryMid]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            appstyles.primaryButton,
            styles.button,
            {
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          <Text style={appstyles.buttonText}>{title}</Text>
        </AnimatedGradient>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden', // prevents edge artifacts
  },
  button: {
    backgroundColor: 'transparent', // critical for gradient
  },
});
