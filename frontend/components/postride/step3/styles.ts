import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            width: '100%',
            flex: 1,
            position: 'relative'
        },
        content: {
            flex: 1,
            width: '100%',
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 5,
            padding: 20
        },
        section: {
            width: '100%',
            marginTop: 30
        },
        text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: '700',
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
    })