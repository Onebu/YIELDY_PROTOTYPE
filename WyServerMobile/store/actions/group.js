import '../../globalvars/globalvars';

export const FETCHGROUP = 'FETCHGROUP';
export const CREATEGROUP = 'CREATEGROUP';
export const FETCHGROUPBYID = 'FETCHGROUPBYID';
export const FETCHGROUPSERVER = 'FETCHGROUPSERVER';
export const FETCHGROUPPARTICIPANTS = 'FETCHGROUPPARTICIPANTS';
export const ADDMEMBER = 'ADDMEMBER';
export const REMOVEMEMBER = 'REMOVEMEMBER';
export const SEARCHUSERBYNAME = 'SEARCHUSERBYNAME';

export const fetchgroup = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/groups/mine',
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
            dispatch({ type: FETCHGROUP, userGroup: resData });
        } catch (err) {
            throw err;
        }
    };
};

export const fetchgroupserver = (groupid) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/groups/' + groupid + '/servers/',
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
            dispatch({ type: FETCHGROUPSERVER, groupServerList: resData });
        } catch (err) {
            throw err;
        }
    }
};

export const fetchgroupparticipants = (groupid) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/groups/' + groupid + '/participants/',
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
            dispatch({ type: FETCHGROUPPARTICIPANTS, groupParticipants: resData });
        } catch (err) {
            throw err;
        }
    }
};

export const fetchgroupbyid = (groupid) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/groups/' + groupid,
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
            dispatch({ type: FETCHGROUPBYID, currentGroup: resData });
        } catch (err) {
            throw err;
        }
    }
};

export const addmember = (memberId, groupId) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            global.API_URL + '/groups/add/' + groupId,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
                body: JSON.stringify({
                    id: memberId,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            throw new Error(errorId);
        }

        const resData = await response.json();
        dispatch({ type: ADDMEMBER, patchStatus: resData });
    }
};

export const removemember = (memberId, groupId) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            global.API_URL + '/groups/remove/' + groupId,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
                body: JSON.stringify({
                    id: memberId,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            throw new Error(errorId);
        }

        const resData = await response.json();
        dispatch({ type: REMOVEMEMBER, patchStatus: resData });
    }
};

export const creategroup = (groupname) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            global.API_URL + '/groups',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
                body: JSON.stringify({
                    name: groupname,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            throw new Error(errorId);
        }

        const resData = await response.json();
        dispatch({ type: CREATEGROUP, createGroup: resData });
    }
};

export const searchuserbyname = (name) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            global.API_URL + '/users/search/' + name,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                }
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            throw new Error(errorId);
        }

        const resData = await response.json();
        dispatch({ type: SEARCHUSERBYNAME, searchedUser: resData });
    }
}