import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            flex: 1,
            padding: 10
        },
        image: {
            width: 100,
            height: 120,
            resizeMode: 'contain',
        },

        content: {
            width:'100%',
        },
        titleText: {
            fontSize: 24,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },

        section: {
            width: '100%',
            marginTop: 10
        },
        tabContainer: {
            flexDirection: 'row',
            marginTop: 10,
            backgroundColor: theme.color.white,
            borderRadius: 30,
            overflow: 'hidden',
            borderColor: theme.color.primary,
            borderWidth: 1
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.color.white,
        },
        activeTab: {
            backgroundColor: theme.color.primary,
            borderRadius: 30,
        },
        tabText: {
            fontSize: 14,
            fontFamily: 'Sora',
            color: theme.color.dark,
            fontWeight: 400
        },

    });
