import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        image_container: {
            width: '100%',
            height: 550, // adjust height as needed
            marginTop: 10,
            paddingRight:40
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 5,
            padding: 20
        },
        titleText: {
            fontSize: 24,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        stepText: {
            fontSize: 14,
            color: theme.color.gray,
            fontFamily: 'Sora'
        },
        button_container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 20,
        },
        button: {
            width: '80%',
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
        skipText: {
            fontSize: 14,
            color: theme.color.purple,
            fontWeight: 400,
            fontFamily: 'Sora'
        },

        step_container: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            position: "absolute",
            bottom: 20,
        },
        forward: {
            width: 40 ,
            height: 40,
            backgroundColor: theme.color.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },
        back: {

        },
        lines_container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
        },
        line: {
            width: 50,
            height: 5,
            backgroundColor: theme.color.gray
        },
        line_active: {
            width: 50,
            height: 5,
            backgroundColor: theme.color.blue
        }

    });
