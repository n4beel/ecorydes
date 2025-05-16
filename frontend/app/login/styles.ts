// import { StyleSheet } from 'react-native';
// import theme from "@/constants/theme";

// export const getStyles = () =>
//     StyleSheet.create({
//         container: {
//             backgroundColor: theme.color.white,
//             width: '100%',
//             flex: 1,
//         },
//         content: {
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'flex-start',
//             paddingTop: 20,
//             paddingHorizontal: 20,
//         },
//         logo: {
//             width: 150,
//             height: 150,
//             resizeMode: 'contain',
//             marginVertical:30
//         },
//         input: {
//             width: '100%',
//             height: 60,
//             borderWidth: 1,
//             borderColor: theme.color.gray, // you can adjust or add grey in your theme
//             borderRadius: 8,
//             paddingHorizontal: 15,
//             marginBottom: 15,
//             fontSize: 16,
//             color: theme.color.dark, 
//             backgroundColor: theme.color.light_gray || '#f9f9f9', 
//             marginTop:10
//         },
//         link:{
//             alignSelf:'flex-start',
//             color:theme.color.blue
//         },
//         button_container: {
//             width: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             paddingHorizontal: 20,
//             position: "absolute",
//             bottom: 20,
//             marginBottom:20
//         },
//         button: {
//             width: '100%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: 55,
//             backgroundColor: theme.color.dark,
//             paddingVertical: 10,
//             paddingHorizontal: 20,
//             borderRadius: 10,
//         },
//         button_text: {
//             fontSize: 14,
//             color: theme.color.white,
//             fontWeight: 400,
//             fontFamily: 'Sora'
//         },
//     });


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