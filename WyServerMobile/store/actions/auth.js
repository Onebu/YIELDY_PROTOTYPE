import { AsyncStorage } from 'react-native';

import '../../globalvars/globalvars';

export const SIGNUP = 'SIGNUP';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const REFETCHPROFILE = 'REFETCHPROFILE';

let timer;

export const authenticate = (token, refreshToken, userInfo, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userInfo: userInfo, token: token, refreshToken: refreshToken });
    };
};

export const signup = (username, email, password) => {
    return async dispatch => {
        const response = await fetch(
            global.API_URL + '/users/signup',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nickname: username,
                    password: password,
                    email: email
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            let message = 'Something went wrong!'
            if (errorId === "Mail exists") {
                message = 'This mail has already registered!';
            } else if (errorId === "Nickname exists") {
                message = 'This username has already registered!';
            } else {
                messsage = 'Registration failed! Contact us!'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch({ type: SIGNUP });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            global.API_URL + '/users/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password,
                    email: email
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            let message = 'Something went wrong!'
            if (errorId === "Auth failed") {
                message = 'This email or password could not be found!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        expiresIn = 140000;
        dispatch(authenticate(resData.token, resData.refreshToken, resData.userInfo, expiresIn));
        const expirationDate = new Date(new Date().getTime() + 15000000);
        saveDataToStorage(resData.token, resData.refreshToken, resData.userInfo, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

export const refetchprofile = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/users/me',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getState().auth.token,
                        'cache-control': 'no-cache',
                        'pragma': 'no-cache'
                    }
                }
            );
            if (response.ok) {
                const resData = await response.json();
                dispatch({ type: REFETCHPROFILE, userInfo: resData });
            }
        } catch (err) {
            throw err;
        }
    };
};
const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
}

const saveDataToStorage = (token, refreshToken, userInfo, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        refreshToken: refreshToken,
        userInfo: userInfo,
        expirationDate: expirationDate.toISOString()
    }));
};