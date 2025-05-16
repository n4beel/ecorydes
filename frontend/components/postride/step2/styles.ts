import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            width: '100%',
            flex: 1,
            // position: 'relative'
        },
        content: {
            flex: 1,
            width: '100%',
            // position:'relative',
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 5,
            padding: 20
        },
        section: {
            width: '100%',
            marginTop: 30
        },
        text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: '700',
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
        days: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 5
        },
        day: {
            width: 40,
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.color.gray,

        },
        input: {
            width: '100%',
            height: 60,
            borderWidth: 1,
            borderColor: theme.color.gray, // you can adjust or add grey in your theme
            borderRadius: 8,
            paddingHorizontal: 15,
            marginBottom: 15,
            fontSize: 16,
            color: theme.color.dark,
            backgroundColor: theme.color.light_gray || '#f9f9f9',
            marginTop: 10
        },
        input_date:{
            width: '100%',
            height: 60,
            borderWidth: 1,
            borderColor: theme.color.gray, // you can adjust or add grey in your theme
            borderRadius: 8,
            paddingHorizontal: 15,
            marginBottom: 15,
            fontSize: 16,
            color: theme.color.dark,
            backgroundColor: theme.color.light_gray || '#f9f9f9',
            marginTop: 10,
            alignItems:'flex-start',
            justifyContent:'center'
        },
        date_text:{
            color:theme.color.gray
        },
        date_picker_container:{
            // position:'fixed',
            // bottom:0,
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
        }
    });
