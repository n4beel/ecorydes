import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        button_container: {
            width: '100%',
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center',
            justifyContent:'space-between',
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 20,
            marginBottom: 20,
            gap:10
        },
        button: {
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.dark,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
        },
        button_outline:{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.white,
            borderColor:theme.color.dark,
            borderWidth:1,
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
        contentContainer: {

        },
        success_container: {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            paddingHorizontal: 20,
            paddingVertical: 20
        },
        title_text: {
            fontSize: 20,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        }
    })