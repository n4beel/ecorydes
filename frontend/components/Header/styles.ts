import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
        },
        arrow_container: {
            display: "flex",
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10
        },
        icon: {
            width: 35,
            height: 35,
            backgroundColor: theme.color.light_gray,
            borderRadius: 50,
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
        },
        titleText: {
            fontSize: 16,
            fontWeight: 600,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
    })