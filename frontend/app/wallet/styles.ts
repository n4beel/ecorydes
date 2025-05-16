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
        list_item: {
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent:'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.color.gray
        },
        list_text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
    })