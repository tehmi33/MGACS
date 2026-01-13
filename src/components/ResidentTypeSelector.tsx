import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import { Control, Controller } from 'react-hook-form';
import { ResidentTypeOption } from '../types/VisitorRequest';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

interface Props {
  control: Control<any>;
  name: string;
  options: ResidentTypeOption[];
}

export default function ResidentTypeSelector({
  control,
  name,
  options,
}: Props) {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Controller
        control={control}
        name={name}
        rules={{ required: 'Resident type is required' }}
        render={({ field: { value, onChange } }) => (
          <RadioButton.Group
            onValueChange={onChange}
            value={value}
          >
            <View style={styles.row}>
              {options.map(opt => (
                <View key={opt.value} style={styles.option}>
                  <RadioButton
                    value={opt.value}
                    color={theme.colors.primary}
                    uncheckedColor={theme.colors.muted}
                  />

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onChange(opt.value)}
                  >
                    <Text
                      style={[
                        appStyles.textInput,
                        styles.label,
                      ]}
                    >
                      {opt.label}
                    </Text>

                    <Text style={appStyles.mutedText}>
                      ({opt.hours})
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        )}
      />
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    label: {
      fontWeight: '600',
      color: theme.colors.text,
    },
  });
