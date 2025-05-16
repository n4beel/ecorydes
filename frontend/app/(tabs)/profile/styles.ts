import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        image: {
            width: 80,
            height: 80,
            borderRadius: 50,
            resizeMode: 'contain',
            marginRight: 10
        },
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 5,
            padding: 10
        },
        register_vehicle: {
            width: '95%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 18,
            backgroundColor: theme.color.light_gray,
            margin: 'auto',
            borderRadius: 10
        },
        list_item: {
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
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
        titleText: {
            fontSize: 15,
            fontWeight: 600,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 12,
            color: theme.color.gray,
            fontFamily: 'Sora'
        },
        signout_container: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20
        },
        signout_text: {
            fontSize: 14,
            color: theme.color.gray,
            fontFamily: 'Sora',
            marginLeft: 10
        },
        edit: {
            width: 25,
            height: 25,
            backgroundColor: theme.color.light_gray,
            borderRadius: 50,
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
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
            bottom:30,
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

    });
