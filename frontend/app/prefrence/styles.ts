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
            padding: 20,
            marginTop: 10
        },
        radios:{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            gap:10
        },
        radio_container:{
            position:'relative',
            width:'100%',
            padding:7,
            borderRadius:15,
            alignItems:'center'
        },
        radio_image:{
            width:'100%',
            borderRadius:15
            
        },
        radio_text:{
            position:'absolute',
            bottom:30,
            color:theme.color.white,
            fontWeight:700,
        },
        circle:{
          position:'absolute',
          top:20,
          right:20,
          width:20,
          height:20,
          borderWidth:2,
          borderColor:theme.color.primary,
          borderRadius:50  
        },
        title_text: {
            fontSize: 14,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: 400,
            marginTop: 5
        },
        button_container: {
            width: '100%',
            alignItems: 'center',
            gap: 15,
            paddingHorizontal: 15,
            marginBottom:10
        }
    })