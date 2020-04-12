import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView ,RefreshControl,Button} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/HeaderButton';
import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/colors';


const ProfileScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.auth.userInfo);


    const loadProfile = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(authActions.refetchprofile());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);


    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProfile
        );

        return () => {
            willFocusSub.remove();
        };
    }, [loadProfile]);

    useEffect(() => {
        setIsLoading(true);
        loadProfile().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProfile]);
    let uriImage;
    if (userInfo.profileImage ) {
        uriImage = userInfo.profileImage;
    } else {
        uriImage = 'https://bootdey.com/img/Content/avatar/avatar6.png';
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadProfile}
                    color={Colors.primary}
                />
            </View>
        );
    }
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size='large'
                    color={Colors.primary}
                />
            </View>
        );
    };
    return (
        <ScrollView
            style={{ flex: 1}}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={loadProfile} />
            }>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{ uri: uriImage }} />
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{userInfo.name}</Text>
                    <Text style={styles.info}>{userInfo.email}</Text>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Opcion 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text>Opcion 2</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

ProfileScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Profile',
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title="Menu" iconName="ios-menu" onPress={() => {
                navData.navigation.toggleDrawer();
            }} />
        </HeaderButtons>
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});
export default ProfileScreen;