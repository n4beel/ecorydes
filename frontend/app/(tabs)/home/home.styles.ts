import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            flex: 1,
            padding: 20
        },
        image: {
            width: 100,
            height: 120,
            resizeMode: 'contain',
        },
        header: {
            display:'flex',
            flexDirection:'row',
            alignItems:'center'
        },
        content: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginTop:30

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
        action_box: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.color.gray,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,

        },
        box_text: {
            fontSize: 20,
            fontWeight: 600,
            color: theme.color.dark,
            fontFamily: 'Sora'
        },
        bell: {
            width: 40,
            height: 40,
            backgroundColor: theme.color.light_gray,
            borderRadius: 50,
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
        }

    });
