import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

interface Props {
  control: Control<any>;
  name: string;
  placeholder: string;
}

export default function DateTimeRangePickerField({
  control,
  name,
  placeholder,
}: Props) {
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // ✅ today at 00:00 (used for minDate)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      defaultValue={null}
      render={({ field: { value, onChange } }) => {
        const displayValue =
          value instanceof Date
            ? `${value.toDateString()} ${value.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : placeholder;

        return (
          <View style={styles.wrapper}>
            <TouchableOpacity
              style={styles.field}
              onPress={() => {
                setTempDate(value ?? null); 
                setDateVisible(true);
              }}
            >
              <Text style={styles.text}>{displayValue}</Text>
            </TouchableOpacity>

            {/* DATE PICKER */}
            <DatePickerModal
              locale="en"
              mode="single"
              visible={dateVisible}
              date={tempDate ?? undefined}
              validRange={{
                startDate: today, 
              }}
              onDismiss={() => setDateVisible(false)}
              onChange={({ date }) => {
                if (!date) return;

                const selectedDate = new Date(date);
                selectedDate.setHours(0, 0, 0, 0);

                setDateVisible(false);
                setTempDate(selectedDate);
                onChange(selectedDate);
                setTimeVisible(true);
              }}
            />

            {/* TIME PICKER */}
            <TimePickerModal
  visible={timeVisible}
  onDismiss={() => setTimeVisible(false)}
  // minutesStep={5} // ✅ 00, 05, 10, 15, 20...
  onConfirm={({ hours, minutes }) => {
    if (!tempDate) return;

    const finalDate = new Date(tempDate);
    finalDate.setHours(hours, minutes, 0);

    setTimeVisible(false);
    onChange(finalDate);
  }}
/>

          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  field: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
  },
  text: {
    textAlign: 'center',
    color: '#0f172a',
  },
});
