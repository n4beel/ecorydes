import Header from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getStyles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '@/constants/theme';
import { Person } from '@/assets';

interface Message {
    text: string;
    isSender: boolean;
}

const Messages = () => {
    const styles = getStyles();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hey there!", isSender: false },
        { text: "How are you?", isSender: false },
        { text: "I'm good, thanks!", isSender: true },
        { text: "Hey there!", isSender: false },
        { text: "How are you?", isSender: false },
        { text: "I'm good, thanks!", isSender: true },
        { text: "Hey there!", isSender: false },
        { text: "How are you?", isSender: false },
        { text: "I'm good, thanks!", isSender: true },
        { text: "Hey there!", isSender: false },
        { text: "How are you?", isSender: false },
        { text: "I'm good, thanks!", isSender: true },
        { text: "Hey there!", isSender: false },
        { text: "How are you?", isSender: false },
        { text: "I'm good, thanks!", isSender: true },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSend = () => {
        if (inputMessage.trim() === '') return;
        setMessages(prev => [...prev, { text: inputMessage.trim(), isSender: true }]);
        setInputMessage('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.custom_header}>
                <Header title="Sam Alexander" image={Person} />
            </View>

            {/* Message List */}
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.isSender ? styles.senderBubble : styles.receiverBubble
                    ]}>
                        <Text style={[
                            styles.messageText,
                            item.isSender ? styles.senderText : styles.receiverText
                        ]}>
                            {item.text}
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.messagesContainer}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
                style={styles.inputContainer}
            >
                <View style={styles.input_wrapper} >
                    <TextInput
                        style={styles.input}
                        placeholder="Write a message..."
                        placeholderTextColor="#aaa"
                        // value={email}
                        // onChangeText={setEmail}
                        keyboardType="ascii-capable"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity>
                        <Ionicons name="send" size={24} color={theme.color.dark} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Messages;
