import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
            alignItems:'center',
            justifyContent:'center'
        },
        list_item: {
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.color.gray
        },
        list_text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        button_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 15,
            position: "absolute",
            bottom: 20,
        },
        button: {
            position: 'absolute',
            bottom: 30,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.dark,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            margin: 'auto'
        },
        button_text: {
            fontSize: 14,
            color: theme.color.white,
            fontWeight: 400,
            fontFamily: 'Sora'
        },
    })