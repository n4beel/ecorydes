
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Home from "@/components/svgs/home";
import { Tabs } from 'expo-router';
import Car from '@/components/svgs/car';
import Chat from '@/components/svgs/chat';
import User from '@/components/svgs/user';

export default function TabLayout() {
    return (
        <Tabs backBehavior="history" screenOptions={{
            tabBarActiveTintColor: 'blue'
        }}>
            <Tabs.Screen
                name="home/index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <Home  />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="myrides/index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <Car />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <User />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
