import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        card: {
            backgroundColor: theme.color.white,
            borderRadius: 10,
            padding: 15,
            marginTop: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 2,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 50,
        },
        name: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: 700
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            flexWrap: 'wrap',
        },
        rating_container: {
            backgroundColor: theme.color.lightgreen,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 7,
            gap: 3,
            paddingVertical: 4,
            transform: 'translateY(-4px)'
        },
        rating: {
            fontSize: 9,
            color: theme.color.dark,
            fontFamily: 'Sora',
        },
        text_sm: {
            fontSize: 8,
            color: theme.color.dark,
            fontFamily: 'Sora',
            marginHorizontal: 5
        },
        priceBox: {
            backgroundColor: theme.color.primary,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        price: {
            fontSize: 14,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: 700
        },
        line: {
            borderTopColor: theme.color.gray,
            borderTopWidth: 1,
            marginVertical: 10
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
