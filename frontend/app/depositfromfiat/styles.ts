import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        card_container: {
            padding: 20
        },
        card: {
            position: 'relative',
            backgroundColor: theme.color.primary,
            padding: 20,
            height: 200,
            borderRadius: 10,
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        title_text: {
            fontSize: 18,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        big_text: {
            fontSize: 24,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        card_image: {
            position: 'absolute',
            right: 20,
            top: 20
        },
        section: {
            width: '100%',
            marginTop: 30,
            padding: 20
        },
        input: {
            width: '100%',
            height: 60,
            borderWidth: 1,
            borderColor: theme.color.gray, // you can adjust or add grey in your theme
            borderRadius: 8,
            paddingHorizontal: 15,
            marginBottom: 15,
            fontSize: 16,
            color: theme.color.dark,
            backgroundColor: theme.color.light_gray || '#f9f9f9',
            marginTop: 15
        },
        warning_container: {
            flexDirection: "row",
            alignItems: 'center',
            gap: 5,
            marginTop: 20
        },
        button_container: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 20,
            marginBottom: 20
        },
        button: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.dark,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
        },
        button_text: {
            fontSize: 14,
            color: theme.color.white,
            fontWeight: 400,
            fontFamily: 'Sora'
        },
    })