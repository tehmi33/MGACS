import { StyleSheet } from 'react-native';
import { Theme } from '../theme/themes';


export const AppStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: theme.colors.screenBg,
      paddingHorizontal: 20,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 10,
    },

    screenTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.title,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 13,
      // color: theme.colors.muted,
      color: theme.colors.text,
      marginBottom: 20,
    },

    mutedText: {
      fontSize: 13,
      color: theme.colors.muted,
    },

    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginBottom: 6,
    },

    errorBorder: {
      borderColor: theme.colors.error,
    },

    buttonText: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.white,
    },

    inputContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      marginVertical: 8,
      paddingHorizontal: 15,
      paddingVertical: 5,
      backgroundColor: theme.colors.cardBg,
      elevation: 1,
    },

    dropdownContainer: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingVertical: 5,
      //  marginVertical: 8,
      justifyContent: 'center',
      backgroundColor: theme.colors.cardBg,
      elevation: 1,
    },

    textInput: {
      fontSize: 14,
      color: theme.colors.text, 
    },

    primaryButton: {
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
      elevation: 3,
    },

    card: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: 16,
      padding: 16,
      elevation: 4,
    },

    heading: {
     color: theme.colors.title,
      fontSize: 14,
      fontFamily: 'Manrope',
      fontWeight: '700',
    },

    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      borderRadius: 999,
      marginLeft: 6,
    },

    badgeIcon: {
      marginRight: 4,
    },

    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.text,
    },
    cancel: {
      textAlign: 'center',
      marginTop: 14,
      color: theme.colors.muted,
      fontWeight: '600',
    },
    backButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.18)',
},

  });
