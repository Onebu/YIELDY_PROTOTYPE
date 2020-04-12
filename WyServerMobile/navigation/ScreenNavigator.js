import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform, SafeAreaView, Button, View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { zoomIn } from 'react-navigation-transitions';
import { useDispatch, useSelector } from 'react-redux';

import DashboardScreen from '../screens/Main/DashboardScreen';
import GroupScreen from '../screens/Main/GroupScreen';
import ServerListScreen from '../screens/Main/ServerListScreen';
import ServerScreen from '../screens/Main/ServerScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import StartupScreen from '../screens/StartupScreen';
import AddGroupScreen from '../screens/Edits/AddGroupScreen';
import GroupDetailScreen from '../screens/Main/GroupDetailScreen';
import MemberScreen from '../screens/Main/MemberScreen';
import AddMemberScreen from '../screens/Edits/AddMemberScreen';
import SearchUserScreen from '../screens/Edits/SearchUserScreen';
import Colors from '../constants/colors';
import Images from '../constants/images';
import * as authActions from '../store/actions/auth';
import DrawerProfile from '../components/DrawerProfile';
import PublishScreen from '../screens/Edits/PublishScreen';

const defaultStackNavOptions = {

    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    HeaderBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const DashboardNavigator = createStackNavigator({
    Dashboard: DashboardScreen
}, {
    mode: 'modal',
    defaultNavigationOptions: defaultStackNavOptions
});

const GroupNavigator = createStackNavigator({

    Group: {
        screen: GroupScreen,
        navigationOptions: {
            headerTitle: 'My Groups',
        }
    },
    ServerList: {
        screen: ServerListScreen,
        navigationOptions: {
            headerTitle: 'Group\'s Servers',
        }
    },
    Server: {
        screen: ServerScreen,
    },
    AddGroup: {
        screen: AddGroupScreen,
        navigationOptions: {
            headerTitle: 'Creating group',
        }
    },
    GroupDetail: {
        screen: GroupDetailScreen,
    },
    Member: {
        screen: MemberScreen,
    },
    AddMember: {
        screen: AddMemberScreen,
    },
    Publish: {
        screen: PublishScreen
    },
    SearchUser: {
        screen: SearchUserScreen
    }

},
    {
        mode: 'modal',
        defaultNavigationOptions: defaultStackNavOptions
    });

const ServerNavigator = createStackNavigator({

    ServerList: {
        screen: ServerListScreen,
        navigationOptions: {
            headerTitle: 'My Servers',
        }
    },
    Server: {
        screen: ServerScreen,
    },

},
    {
        mode: 'modal',
        defaultNavigationOptions: defaultStackNavOptions

    });

const ProfileNavigator = createStackNavigator({

    Profile: ProfileScreen
}, {
    mode: 'modal',
    defaultNavigationOptions: defaultStackNavOptions
});

const TabScreenConfig = {

    Dashboard: {
        screen: DashboardNavigator,
        navigationOptions: {
            headerTitle: 'Dashboard',
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name="view-dashboard-outline" size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.tab
        }
    },
    Group: {
        screen: GroupNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name="account-group" size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.tab
        }
    },
    Servers: {
        screen: ServerNavigator,
        navigationOptions: {
            headerTitle: 'Servers',
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name="server" size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.tab
        }
    },
    Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
            headerTitle: 'My Profile',
            tabBarIcon: (tabInfo) => {
                return (<MaterialCommunityIcons name="face-profile" size={25} color={tabInfo.tintColor} />);
            },
            tabBarColor: Colors.tab
        }
    },

};

const BottomNavigator = Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(TabScreenConfig, {
        activeColor: 'white',
        shifting: true,
        navigationOptions: {
            //drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-create': 'ios-create'}  size = {23} color={drawerConfig.tintColor}/>
        },
    }) :
    createBottomTabNavigator(TabScreenConfig, {
        tabBarOptions: {
            labelStyle: {
                fontFamily: 'open-sans-bold'
            },
            activeTintColor: Colors.secondary
        },
        navigationOptions: {
            //drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-create': 'ios-create'}  size = {23} color={drawerConfig.tintColor}/>
        },
    });

const LoginNavigator = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
},
    {
        mode: 'modal',
        navigationOptions: {

        },
        defaultNavigationOptions: defaultStackNavOptions,
        transitionConfig: () => zoomIn(),
    });
const DrawerNavigator = createDrawerNavigator({

    Startup: {
        screen: StartupScreen,
        navigationOptions: {
            drawerLabel: () => null
        },
    },
    Login: {
        screen: LoginNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    Main: {
        screen: BottomNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },

}, {
    contentOptions: {
        activeTintColor: Colors.accent_secondary,
        labelStyle: {
            fontFamily: 'open-sans-bold'
        },
    },
    transitionConfig: () => zoomIn(),
    drawerWidth: 240,
    contentComponent: props => {
        const dispatch = useDispatch();
        const userInfo = useSelector(state => state.auth.userInfo);
        return (
            <View style={{
                flex: 1,
                paddingTop: 26,
                backgroundColor: '#ffe1ff'
            }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <DrawerItems {...props} />
                    {!userInfo ? null : <DrawerProfile
                        name={userInfo.name}
                        email={userInfo.email}
                        image={!!userInfo.profileimage ? userInfo.profileimage : Images.default}></DrawerProfile>}
                    <Button title="Logout"
                        color={Colors.primary_s}
                        onPress={() => {
                            dispatch(authActions.logout());
                            props.navigation.navigate({ routeName: 'Login' })
                        }} />
                </SafeAreaView>
            </View>
        );
    }
});


export default createAppContainer(DrawerNavigator);

