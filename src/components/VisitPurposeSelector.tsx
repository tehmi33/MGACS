import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Controller, Control, useWatch } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

interface Option {
  label: string;
  value: string;
}

interface Props {
  control: Control<any>;
  name: string;
  otherName: string;
  isOtherName: string;
  label?: string;
  placeholder: string;
  otherPlaceholder?: string;
  data: Option[];
}

export default function DropdownWithOther({
  control,
  name,
  otherName,
  isOtherName,
  placeholder,
  otherPlaceholder = 'Enter other',
  data,
}: Props) {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  const isOther = useWatch({
    control,
    name: isOtherName,
    defaultValue: false,
  });

  return (
    <View style={[styles.row, { marginVertical: 15 }]}>
      <View style={{ flex: 1 }}>
        {/* DROPDOWN CONTROLLER */}
        {!isOther && (
          <Controller
            control={control}
            name={name}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value }, fieldState }) => (
              <View
                style={[
                  appStyles.dropdownContainer,
                  fieldState.error && appStyles.errorBorder,
                ]}
              >
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownList}
                  data={data}
                  labelField="label"
                  valueField="value"
                  placeholder={placeholder}
                  value={value}
                  onChange={item => onChange(item.value)}
                  itemTextStyle={[
                    appStyles.textInput,
                    styles.itemText,
                  ]}
                  selectedTextStyle={[
                    appStyles.textInput,
                    styles.itemText,
                  ]}
                  placeholderStyle={appStyles.mutedText}
                  activeColor={theme.colors.infoLight}
                />
              </View>
            )}
          />
        )}

        {/* OTHER TEXTINPUT CONTROLLER */}
        {isOther && (
          <Controller
            control={control}
            name={otherName}
            rules={{ required: 'Please specify other' }}
            render={({ field: { onChange, value }, fieldState }) => (
              <View
                style={[
                  appStyles.dropdownContainer,
                  fieldState.error && appStyles.errorBorder,
                ]}
              >
                <TextInput
                  style={[
                    appStyles.textInput,
                    styles.otherInput,
                  ]}
                  placeholder={otherPlaceholder}
                  placeholderTextColor={theme.colors.placeholder}
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
        )}
      </View>

      {/* OTHER CHECKBOX */}
      <Controller
        control={control}
        name={isOtherName}
        render={({ field: { onChange, value } }) => (
          <View style={styles.otherBox}>
            <Checkbox
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
              color={theme.colors.primary}
              uncheckedColor={theme.colors.muted}
            />
            <Text
              style={[
                appStyles.textInput,
                styles.otherLabel,
              ]}
            >
              Other
            </Text>
          </View>
        )}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    otherBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdown: {
      height: 42,
      width: '100%',
      paddingHorizontal: 15,
    },
    dropdownList: {
      backgroundColor: theme.colors.cardBg,
      marginTop: 4,
      elevation: 6,
    },
    itemText: {
      fontWeight: '500',
      color: theme.colors.text,
    },
    otherInput: {
      paddingHorizontal: 15,
      height: 42,
    },
    otherLabel: {
      paddingHorizontal: 6,
      fontWeight: '500',
    },
  });
