import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.color.white,
            width: '100%',
            flex: 1,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
            backgroundColor: theme.color.white,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 2,
            padding: 15,
            marginTop: 15,
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
        stops_container: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 15,
            marginTop: 20
        },
        stop_item: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
            gap: 10,
        },
        location_wrapper: {
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: theme.color.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        icon_wrapper: {
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center'
        },
        stopLabel: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora',
            marginTop: 2, // (Optional small adjustment to align better)
        },

        stopAddress: {
            fontSize: 12,
            color: theme.color.dark,
            fontFamily: 'Sora',
            flexWrap: 'wrap',
        },
        dropoff_wrapper: {
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: theme.color.light_red
        },
        info_container: {
            display: "flex",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 15,

        },
        info_item: {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
        },
        rating_container: {
            backgroundColor: theme.color.lightgreen,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 7,
            gap: 3,
            paddingVertical: 4,
        },
        total_rides: {
            backgroundColor: theme.color.light_blue,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10
        },
        joined: {
            backgroundColor: theme.color.lightgreen,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10
        },
        text: {
            fontSize: 11,
            color: theme.color.dark,
            fontFamily: 'Sora',
            fontWeight: 400
        },
        passenger_container: {
            marginTop: 25 
        },
        seats_container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 15
        },
        title_text: {
            fontSize: 16,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        seat_item: {
            alignItems: 'center',
            gap: 10
        },
        seat_image: {
            backgroundColor: theme.color.light_blue,
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },
        vehicle_detail_container: {
            marginTop: 25
        },
        vehicle_detail: {
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 10
        },
        vehicle_info: {

        },
        text_bold: {
            fontSize: 12,
            fontWeight: 700,
            color: theme.color.dark,
            fontFamily: 'SoraBold'
        },
        text_gray: {
            fontSize: 11,
            fontWeight: 400,
            color: theme.color.gray,
            fontFamily: 'Sora'
        },
        line: {
            borderTopColor: theme.color.light_gray,
            borderTopWidth: 1,
            marginVertical: 20
        },
        button_container: {
            width: '100%',
            marginTop: 20,
            alignItems: 'center',
            gap: 15,
            paddingHorizontal: 10
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
        button: {
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.dark,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
        },
        button_outline: {
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 55,
            backgroundColor: theme.color.white,
            borderColor: theme.color.dark,
            borderWidth: 1,
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
        routeSection: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginTop: 10,
        },
        routeText: {
            fontSize: 11,
            color: theme.color.dark,
            fontFamily: 'Sora',
            paddingRight:10
        },

    })