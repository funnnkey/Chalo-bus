import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface SearchInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFocus?: () => void;
  editable?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  onFocus,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.MEDIUM_GRAY}
        onFocus={onFocus}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 8,
    borderWidth: 2,
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    padding: SPACING.MD,
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
});
