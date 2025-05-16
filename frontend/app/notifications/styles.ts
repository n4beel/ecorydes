import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        notification_container: {
            width: '100%',
            borderWidth: 1,
            borderColor: theme.color.gray,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginBottom: 15
        },
        title_text: {
            fontSize: 12,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold',        
        },
        dot:{
            width:10,
            height:10,
            borderRadius:50,
            backgroundColor:theme.color.success
        },
        text: {
            fontSize: 11,
            color: theme.color.dark,
            fontFamily: 'Sora',
            marginTop:5
        }
    })