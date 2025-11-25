import React from 'react';
import { Platform, View, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CrossPlatformDateTimePickerProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'calendar' | 'clock' | 'compact';
  onChange: (event: any, selectedDate?: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
  testID?: string;
}

/**
 * Cross-platform DateTimePicker component
 * - On web: Uses TextInput with type prop (allows manual typing)
 * - On native: Uses @react-native-community/datetimepicker
 */
const CrossPlatformDateTimePicker: React.FC<CrossPlatformDateTimePickerProps> = ({
  value,
  mode = 'date',
  display,
  onChange,
  minimumDate,
  maximumDate,
  style,
  testID,
}) => {
  // Web platform: Use native HTML input element
  if (Platform.OS === 'web') {
    // Format date for HTML input (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      if (mode === 'date') {
        return `${year}-${month}-${day}`;
      } else if (mode === 'time') {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      } else {
        // datetime
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    };

    // Parse input value to Date
    const parseInputToDate = (inputValue: string): Date => {
      if (mode === 'date') {
        return new Date(inputValue + 'T00:00:00');
      } else if (mode === 'time') {
        const [hours, minutes] = inputValue.split(':');
        const date = new Date(value);
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date;
      } else {
        // datetime
        return new Date(inputValue);
      }
    };

    const inputType = mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local';
    const inputValue = formatDateForInput(value);

    // Use React.createElement to create a native HTML input element for web
    return React.createElement('input', {
      type: inputType,
      value: inputValue,
      min: minimumDate ? formatDateForInput(minimumDate) : undefined,
      max: maximumDate ? formatDateForInput(maximumDate) : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue) {
          const newDate = parseInputToDate(newValue);
          // Create a mock event object similar to native DateTimePicker
          onChange({ type: 'set', nativeEvent: { timestamp: newDate.getTime() } }, newDate);
        }
      },
      style: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontFamily: 'inherit',
        ...(style as any),
      },
      'data-testid': testID,
    });
  }

  // Native platforms: Use original DateTimePicker
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={display}
      onChange={onChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
  },
  webInput: {
    width: '100%',
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    ...(Platform.OS === 'web' && {
      // Web-specific styles
      padding: '8px 12px',
      fontFamily: 'inherit',
    }),
  },
});

export default CrossPlatformDateTimePicker;

