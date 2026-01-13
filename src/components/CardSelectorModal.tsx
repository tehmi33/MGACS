import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';

/* ---------------- TYPES ---------------- */

export type IconSet =
  | 'MaterialIcons'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Ionicons'
  | 'MaterialCommunityIcons';

export type IconSelectorItem<T extends string = string> = {
  id: T;
  title: string;
  iconName: string;
  iconSet?: IconSet;
};

interface IconSelectorModalProps<T extends string> {
  visible: boolean;
  title: string;
  data: IconSelectorItem<T>[];
  onClose: () => void;
  onSelect: (id: T) => void;
}

/* ---------------- ICON RENDERER ---------------- */

const IconRenderer = ({
  name,
  set = 'MaterialIcons',
  size = 28,
  color,
}: {
  name: string;
  set?: IconSet;
  size?: number;
  color?: string;
}) => {
  switch (set) {
    case 'FontAwesome5':
      return <FontAwesome5 name={name} size={size} color={color} />;

    case 'FontAwesome6':
      return <FontAwesome6 name={name} size={size} color={color} />;

    case 'Ionicons':
      return <Ionicons name={name} size={size} color={color} />;

    case 'MaterialCommunityIcons':
      return (
        <MaterialCommunityIcons name={name} size={size} color={color} />
      );

    default:
      return <MaterialIcons name={name} size={size} color={color} />;
  }
};

/* ---------------- COMPONENT ---------------- */

function IconSelectorModal<T extends string>({
  visible,
  title,
  data,
  onClose,
  onSelect,
}: IconSelectorModalProps<T>) {
  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={appStyles.screenTitle}>{title}</Text>

          <View style={styles.grid}>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => onSelect(item.id)}
              >
                <View style={styles.iconWrapper}>
                  <IconRenderer
                    name={item.iconName}
                    set={item.iconSet}
                    color={theme.colors.primary}
                  />
                </View>

                <Text style={appStyles.heading}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={[appStyles.heading, styles.cancel]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    container: {
      width: '85%',
      backgroundColor: theme.colors.cardBg,
      borderRadius: 22,
      paddingVertical: 24,
      alignItems: 'center',
      elevation: 8,
    },

    grid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '90%',
    },

    card: {
      width: '47%',
      backgroundColor: theme.colors.primary + '12',
      borderRadius: 18,
      paddingVertical: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary + '22',
    },

    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },

    cancel: {
      marginTop: 14,
      color: theme.colors.danger,
    },
  });

export default IconSelectorModal;
