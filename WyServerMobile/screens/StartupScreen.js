import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/colors';
import * as authActions from '../store/actions/auth';


const StartupScreen = props => {

    const dispatch = useDispatch();
    useEffect(() => {

        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                props.navigation.navigate('Login');
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, refreshToken, userInfo, expirationDate } = transformedData;
            //Should replace with refresh
            if (expirationDate <= new Date() || !token || !userInfo || !refreshToken) {
                props.navigation.navigate('Login')
                return;
            }
            const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();

            props.navigation.navigate('Main');
            dispatch(authActions.authenticate(token, refreshToken, userInfo,expirationTime));
        };

        tryLogin();

    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;