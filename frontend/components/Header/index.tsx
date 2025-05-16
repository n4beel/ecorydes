import theme from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useRouter } from 'expo-router';


interface HeaderProps {
    title: string;
    route?: string;
    image?: ImageSourcePropType;
}

const Header: React.FC<HeaderProps> = ({ title, route, image }) => {
    const styles = getStyles();
    const router = useRouter();

    const handleBack = () => {
        try {
            router.back();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.arrow_container}>
                <TouchableOpacity style={styles.icon} onPress={handleBack}>
                    <Feather name="arrow-left" size={20} color={theme.color.dark} />
                </TouchableOpacity>
                {image ? <Image source={image} /> : ''}
                <Text style={styles.titleText}>{title}</Text>
            </View>
        </View>
    );
};

export default Header;
