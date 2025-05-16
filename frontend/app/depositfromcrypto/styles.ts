import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.color.white,
            width: '100%',
        },
        custom_header: {
            backgroundColor: theme.color.primary,
            height: 350,
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 10,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
        },
        qr_container: {
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        content: {
            padding: 20,
            marginTop: 60
        },
        text: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: 400
        },
        text_dark:{
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'SoraBold',
            fontWeight: 700,
        },
        address_container:{
            backgroundColor:theme.color.lightgreen,
            padding:10,
            marginTop:10,
            borderRadius:10
        },
        warning_container:{
            flexDirection:"row",
            alignItems:'center',
            gap:5,
            marginTop:20
        },
        network_container:{
            marginTop:20
        },
        solana:{
            backgroundColor:theme.color.lightgreen,
            padding:10,
            marginTop:10,
            borderRadius:10,
            width:"30%"
        }
    })