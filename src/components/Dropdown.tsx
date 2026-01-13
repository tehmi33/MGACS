import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Option } from '../types/common';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

interface Props<TValue = string | number> {
  control: Control<any>;
  name: string;
  placeholder: string;
  data: Option<TValue>[];
  rules?: object;
}

export default function DropDown<TValue = string | number>({
  control,
  name,
  placeholder,
  data,
  rules = { required: 'This field is required' },
}: Props<TValue>) {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => {
        // Find the label matching the current ID/Value in the form state
        const selectedLabel = useMemo(() => 
          data.find(d => d.value === value)?.label ?? '', 
        [data, value]);

        const [query, setQuery] = useState(selectedLabel);
        const [focused, setFocused] = useState(false);

        // SYNC: Update text input when the form value or data list changes (Crucial for Edit mode)
        useEffect(() => {
          if (!focused) {
            setQuery(selectedLabel);
          }
        }, [selectedLabel, focused]);

        const filteredData = useMemo(() => {
          if (!query || query === selectedLabel) return data;
          return data.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
          );
        }, [query, data, selectedLabel]);

        return (
          <View style={styles.container}>
            {/* INPUT */}
            <View
              style={[
                appStyles.dropdownContainer,
                focused && styles.focusedBorder,
              ]}
            >
              <TextInput
                value={query}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                style={[styles.input, appStyles.textInput]}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  // Small delay to allow onPress to trigger before focus is lost
                  setTimeout(() => {
                    setFocused(false);
                    setQuery(selectedLabel); // Revert to actual selection if user didn't pick anything new
                  }, 200);
                }}
                onChangeText={setQuery}
              />
            </View>

            {/* INLINE DROPDOWN */}
            {focused && filteredData.length > 0 && (
              <View style={styles.dropdown}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 180 }}
                >
                  {filteredData.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.value}-${index}`}
                      style={styles.item}
                      onPress={() => {
                        onChange(item.value);
                        setQuery(item.label);
                        setFocused(false);
                      }}
                    >
                      <Text
                        style={[
                          appStyles.textInput,
                          styles.itemText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 8,
      zIndex: 10, // Ensure dropdown stays on top of other elements
    },
    input: {
      height: 42,
      paddingHorizontal: 15,
    },
    focusedBorder: {
      borderColor: theme.colors.primary,
    },
    dropdown: {
      marginTop: 4,
      maxHeight: 180,
      borderRadius: 10,
      backgroundColor: theme.colors.cardBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 3,
      // For iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    itemText: {
      fontWeight: '500',
      color: theme.colors.text,
    },
  });