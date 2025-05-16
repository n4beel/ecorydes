import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        content: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            paddingHorizontal: 20,
        },
        section: {
            width:'100%',
            display:"flex",
            alignItems:'center',
            gap:20,
            padding:10
        },
        text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora',
            textAlign:'center'
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
        button_outline:{
            width: '100%',
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap:10,
            height: 55,
            backgroundColor: theme.color.white,
            borderWidth:1,
            borderColor:theme.color.dark,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10, 
        }
    })