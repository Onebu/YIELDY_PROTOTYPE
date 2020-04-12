import '../../globalvars/globalvars';

export const FETCHSERVERBYID = 'FETCHSERVERBYID';
export const FETCHSERVERME = 'FETCHSERVERME';

export const fetchserverbyid = (serverId) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/servers/'+serverId,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getState().auth.token,
                        'cache-control': 'no-cache',
                        'pragma': 'no-cache'
                    }
                }
            );
            const resData = await response.json();
            dispatch({ type: FETCHSERVERBYID, currentServer: resData });
        } catch (err) {
            throw err;
        }
}
};

export const fetchserverme = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/servers/me/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getState().auth.token,
                        'cache-control': 'no-cache',
                        'pragma': 'no-cache'
                    }
                }
            );
            const resData = await response.json();
            dispatch({ type: FETCHSERVERME, allServer: resData });
        } catch (err) {
            throw err;
        }
}
}