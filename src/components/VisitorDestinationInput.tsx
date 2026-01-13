import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

interface Props {
  control: Control<any>;
  name: string;
  placeholder: string;
}

export default function VisitorDestinationInput({
  control,
  name,
  placeholder,
}: Props) {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange, value }, fieldState }) => (
        <View
          style={[
            appStyles.inputContainer,
            styles.container,
            fieldState.error && appStyles.errorBorder,
          ]}
        >
          <TextInput
            multiline
            numberOfLines={4}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={value ?? ''}
            onChangeText={onChange}
            style={[appStyles.textInput, styles.input]}
          />
        </View>
      )}
    />
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      minHeight: 80,
      marginTop: 0,
    },
    input: {
      flex: 1,
      textAlignVertical: 'top',
    },
  });
