import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            width: '100%',
            flex: 1,
            position: 'relative'
        },
        content: {
            flex: 1,
            width: '100%',
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
            fontWeight: 700
        },
        reverse: {
            alignSelf: 'center'
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
        button_container: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingHorizontal: 20,
            position: "absolute",
            bottom: 20,
            marginBottom: 20
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
        stop_input_container: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
        },
        trash_container: {
            width: 35,
            height: 35,
            borderRadius: 50,
            backgroundColor: theme.color.light_red,
            alignItems: 'center',
            justifyContent: 'center'
        },
        add_stop_container: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        add_stop: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        suggestionsContainer: {
            width: '100%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            zIndex: 100,
            maxHeight: 200,
            padding: 5,
          },
          suggestionItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            zIndex:999,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'flex-start',
            gap:10
          },
    })