import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Button,
    ScrollView,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-tiny-toast';
import { NavigationActions } from 'react-navigation';

import Input from '../../components/Input';
import Card from '../../components/Card';
import Colors from '../../constants/colors';
import * as authAction from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {

    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const LoginScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured!', error, [{ text: 'Okay' }])
        }
    }, [
        error
    ]);

    const loginHandler = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                authAction.login(
                    formState.inputValues.email,
                    formState.inputValues.password
                )
            );
            setIsLoading(false);
            Toast.showSuccess('Login succed!');
            props.navigation.navigate('Main', {}, NavigationActions.navigate({ routeName: 'Dashboard' }))
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={[Colors.backgroud, Colors.backgroud]} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail"
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize="none"
                            errorMessage="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="password"
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={8}
                            autoCapitalize="none"
                            errorMessage="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                            returnKeyType='send'
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size='small' color={Colors.primary_s} />
                            ) : (
                                    <Button
                                        title="LOGIN"
                                        color={Colors.primary}
                                        onPress={loginHandler}
                                    />)}
                        </View>
                        {isLoading ? (null) : (<View style={styles.buttonContainer}>
                            <Button
                                title="Switch to Sign Up"
                                color={Colors.accent_secondary}
                                onPress={() => {
                                    props.navigation.replace({ routeName: 'Register' })
                                }}
                            />
                        </View>)}
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

LoginScreen.navigationOptions = {
    headerTitle: 'Login'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default LoginScreen;