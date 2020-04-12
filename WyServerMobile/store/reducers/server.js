import { FETCHSERVERBYID,FETCHSERVERME } from '../actions/server';

const initialState = {
    server: [],
    allServer: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHSERVERBYID:
            return {
                ...state,
                server: [action.currentServer]
            };
        case FETCHSERVERME:
            return {
                ...state,
                allServer: action.allServer
            };
        default:
            return state;
    }

    return state;
};
