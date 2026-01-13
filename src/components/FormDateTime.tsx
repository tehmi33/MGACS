import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

interface Props {
  value?: Date;                     // LOCAL Date
  onChange: (date: Date) => void;   // return LOCAL Date
  error?: string;
  label?: string;
  placeholder?: string;
}

export const FormDateTime = ({
  value,
  onChange,
  error,
  placeholder = 'Tap to select date & time',
}: Props) => {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  // Always use LOCAL date
  const currentValue = value ?? new Date();

  const handleChange = (_: any, selected?: Date) => {
    // Cancel pressed
    if (!selected) {
      setShowPicker(false);
      setMode('date');
      return;
    }

    if (mode === 'date') {
      const updated = new Date(currentValue);
      updated.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );

      setMode('time');
      setShowPicker(true);
      onChange(updated);
      return;
    }

    if (mode === 'time') {
      const updated = new Date(currentValue);
      updated.setHours(
        selected.getHours(),
        selected.getMinutes(),
        0,
        0
      );

      setShowPicker(false);
      setMode('date');
      onChange(updated);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          appStyles.inputContainer,
          styles.touchable,
          error && appStyles.errorBorder,
        ]}
        onPress={() => {
          setMode('date');
          setShowPicker(true);
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            appStyles.textInput,
            !value && styles.placeholderText,
          ]}
        >
          {value
            ? value.toLocaleString('en-PK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={appStyles.errorText}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={currentValue}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minuteInterval={5}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    touchable: {
      paddingVertical: 15,
      justifyContent: 'center',
      marginVertical: 15,
    },
    placeholderText: {
      color: theme.colors.placeholder,
    },
  });
