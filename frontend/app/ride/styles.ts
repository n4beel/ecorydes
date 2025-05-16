import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        bottom_container: {
            height: 250,
            backgroundColor: theme.color.white,
            padding: 10
        },
        sheet_header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10
        },
        title_text: {
            fontSize: 14,
            fontWeight: 400,
            color: theme.color.dark,
            fontFamily: 'Sora',
        },
        images_container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        address_container: {
            marginTop: 20
        },
        routeSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 10,
        },
        routeText: {
            fontSize: 11,
            color: theme.color.dark,
            fontFamily: 'Sora',
        },
        button_container: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingHorizontal: 10,
            marginTop:20
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

    })