import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import {
  DatePickerModal,
  TimePickerModal,
} from 'react-native-paper-dates';

interface Props {
  control: Control<any>;
}

export default function DateTimeRangePickerField({ control }: Props) {
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  // Temporary selected date
  const [tempDate, setTempDate] = useState<Date | null>(null);

  return (
    <Controller
      name="visitDateTime"
      control={control}
      rules={{ required: 'Date & time is required' }}
      defaultValue={null}
      render={({ field: { value, onChange }, fieldState }) => {
        const format = (date: Date) =>
          `${date.toDateString()} ${date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`;

        return (
          <View style={styles.container}>
            <Text style={styles.label}>Visit Date & Time</Text>

            {/* SINGLE FIELD */}
            <TouchableOpacity
              style={[
                styles.field,
                fieldState.error && styles.errorBorder,
              ]}
              onPress={() => setDateVisible(true)}
            >
              <Text style={styles.text}>
                {value ? format(value) : 'Select date & time'}
              </Text>
            </TouchableOpacity>

            {/* DATE PICKER */}
            <DatePickerModal
              locale="en"
              mode="single"
              visible={dateVisible}
              date={tempDate ?? undefined}
              onDismiss={() => setDateVisible(false)}
              onConfirm={({ date }) => {
                setDateVisible(false);
                if (!date) return;
                setTempDate(date);
                setTimeVisible(true);
              }}
            />

            {/* TIME PICKER */}
            <TimePickerModal
              visible={timeVisible}
              onDismiss={() => setTimeVisible(false)}
              onConfirm={({ hours, minutes }) => {
                setTimeVisible(false);
                if (!tempDate) return;

                const finalDate = new Date(tempDate);
                finalDate.setHours(hours);
                finalDate.setMinutes(minutes);
                finalDate.setSeconds(0);

                onChange(finalDate);
              }}
            />

            {fieldState.error && (
              <Text style={styles.errorText}>
                {fieldState.error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#334155',
  },
  field: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 15,
    color: '#0f172a',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  errorBorder: {
    borderColor: 'red',
  },
});
