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
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 30,
            marginTop: 30
        },
        upload_container: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 20,
        },
        image:{
            width:"100%",
            height:195,
            borderRadius: 10,
        },
        upload_box: {
            width: '100%',
            height: 200,
            borderStyle: 'dashed',
            borderWidth: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderColor: theme.color.gray
        },
        label: {
            marginBottom: 10,
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        button_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:"center",
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 40,
        },
        button: {
            width: '98%',
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
    })