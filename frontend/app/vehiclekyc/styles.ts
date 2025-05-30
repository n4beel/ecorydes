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
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 10,
            marginTop: 30,
            padding: 20
        },
        upload_container: {
            width: "100%",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "flex-start",
            paddingHorizontal: 0,
            marginTop:10
        },
        image: {
            width: "100%",
            height: 195,
            borderRadius: 10,
        },
        id_form: {
            width: '100%',
            gap: 3,
            padding:20
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
            borderColor: theme.color.gray,
            marginTop: 10
        },
        label: {
            marginBottom: 10,
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        top: {
            padding: 20,
            marginTop: 20
        },
        titleText: {
            fontSize: 14,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },

        button_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "center",
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 10,
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
            fontSize: 16,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
    })