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
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-tiny-toast';

import Input from '../../components/Input';
import Card from '../../components/Card';
import Colors from '../../constants/colors';
import * as commentActions from '../../store/actions/comment';

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

const PublishScreen = props => {
    const groupId = props.navigation.getParam('groupId');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            body: '',
        },
        inputValidities: {
            body: false,
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

    const createHandler = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                commentActions.postcomment(
                    groupId,
                    formState.inputValues.body,
                    "user"
                )
            );
            Toast.showSuccess('Succed!');
            props.navigation.goBack();
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
                            id="body"
                            label="Comment's body"
                            keyboardType='default'
                            required
                            minLength={6}
                            autoCapitalize="none"
                            numberOfLines={4}
                            errorText="Please enter a valid body(Must be more than 6 letters)."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size='small' color={Colors.primary_s} />
                            ) : (
                                    <Button
                                        title="CREATE"
                                        color={Colors.primary}
                                        onPress={createHandler}
                                    />)}
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

PublishScreen.navigationOptions ={
    headerTitle: 'Publish'
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
export default PublishScreen;