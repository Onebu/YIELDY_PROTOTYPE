import { AUTHENTICATE, SIGNUP, LOGOUT, REFETCHPROFILE } from '../actions/auth';

const initialState = {
    token: null,
    refreshToken: null,
    userInfo: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SIGNUP:
            return initialState;
        case AUTHENTICATE:
            return {
                token: action.token,
                refreshToken: action.refreshToken,
                userInfo: action.userInfo
            };
        case LOGOUT:
            return initialState;
        case REFETCHPROFILE:
            return {
                token: state.token,
                refreshToken:state.refreshToken,
                userInfo: action.userInfo
            };
        default:
            return state;
    }

    return state;
};