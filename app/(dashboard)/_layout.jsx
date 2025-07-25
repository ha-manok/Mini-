import { Tabs } from "expo-router"
import { useColorScheme, StatusBar,Pressable, View } from "react-native"
import { colors } from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/ThemedButton";
import { useAuthState } from "../../hooks/useAuthState";

const router = useRouter();

const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
    const { isAuthenticated, user } = useAuthState()

    const renderHeaderRight = () => {
        if (isAuthenticated) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>
                        Hi, {user?.displayName?.split(' ')[0] || 'User'}
                    </ThemedText>
                </View>
            )
        } else {
            return (
                <ThemedButton
                    onPress={() => router.push("/(auth)/login")}
                    useGradient={false}
                    style={{ 
                        backgroundColor: 'transparent', 
                        borderWidth: 1, 
                        borderColor: '#ccc',
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        marginRight: 10,
                    }}
                >
                    <ThemedText>
                        Login
                    </ThemedText>
                </ThemedButton>
            )
        }
    }
    
    return (
        <>
            <StatusBar style="auto"/>
            <Tabs
                screenOptions={{ 
                    tabBarStyle: {
                        backgroundColor: theme.navBackground,
                        paddingTop: 10,
                        height: 90
                    },
                    headerTitleStyle: {
                        fontSize: 20,
                        fontFamily: 'Inter_400Regular',
                        color:theme.title,
                    },
                    headerStyle: {
                        backgroundColor: theme.navBackground,
                        elevation: 0,             
                        shadowOpacity: 0, 
                        borderBottomWidth: 0.3,
                        borderBottomColor:'#F3F4F6',
                    },
                    tabBarActiveTintColor: theme.iconColorFocused,
                    tabBarInactiveTintColor: theme.iconColor
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: "Home", 
                        headerTitle: "GradePoint",
                        headerRight: renderHeaderRight,
                        tabBarIcon: ({focused}) => (
                            <Ionicons size={24} name="home-outline" color={focused ? theme.iconColorFocused : theme.iconColor} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="Calc"
                    options={{
                        headerShown:false,
                        tabBarIcon: ({focused}) => ( 
                        <Ionicons size={24} name="calculator-outline"  color={focused ? theme.iconColorFocused : theme.iconColor}/>)
                    }}
                />
                <Tabs.Screen
                    name="History"
                    options={{
                        headerShown:false,
                        tabBarIcon: ({focused}) => ( 
                        <Ionicons size={24} name="time-outline" color={focused ? theme.iconColorFocused : theme.iconColor}/>)
                    }}
                />
                <Tabs.Screen
                    name="Settings"
                    options={{
                        title: 'Settings',
                         tabBarIcon: ({focused}) => ( 
                        <Ionicons size={24} name="settings-outline" color={focused ? theme.iconColorFocused : theme.iconColor}/>)
                    }}
                />
            </Tabs>
        </>
    )
}

export default DashboardLayout