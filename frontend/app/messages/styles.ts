import { StyleSheet } from 'react-native';
import theme from "@/constants/theme";

export const getStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.color.white,
            width: '100%',
        },
        custom_header: {
            backgroundColor: theme.color.primary,
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 10,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
        },
        messagesContainer: {
            padding: 20,
            paddingBottom: 100, // leave space for input field
        },
        messageBubble: {
            maxWidth: '80%',
            padding: 12,
            borderRadius: 20,
            marginBottom: 10,
        },
        senderBubble: {
            backgroundColor: theme.color.dark,
            alignSelf: 'flex-end',
            borderBottomRightRadius: 0,
        },
        receiverBubble: {
            backgroundColor: theme.color.primary,
            alignSelf: 'flex-start',
            borderBottomLeftRadius: 0,
        },
        messageText: {
            fontSize: 16,
        },
        senderText: {
            color: theme.color.white,
        },
        receiverText: {
            color: theme.color.dark,
        },
        inputContainer: {
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        input_wrapper: {
            width: '95%',
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.color.gray, // you can adjust or add grey in your theme
            borderRadius: 8,
            paddingHorizontal: 15,
            fontSize: 16,
            color: theme.color.dark,
            backgroundColor: theme.color.light_gray || '#f9f9f9',
            marginBottom:25
        },
        input: {
            width:'90%',
            height: 60,
        },
    });
