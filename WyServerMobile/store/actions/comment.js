import '../../globalvars/globalvars';

export const FETCHRELATEDCOMMENTS = 'FETCHRELATEDCOMMENTS';
export const FETCHGROUPCOMMENTS = 'FETCHGROUPCOMMENTS';
export const POSTCOMMENT = 'POSTCOMMENT';

export const fetchrelatedcomments = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/comments/related',
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
            dispatch({ type: FETCHRELATEDCOMMENTS, relatedComments: resData });
        } catch (err) {
            throw err;
        }
    };
};

export const fetchgroupcomments = (groupid) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch(
                global.API_URL + '/comments/group/' + groupid,
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
            dispatch({ type: FETCHGROUPCOMMENTS, groupComments: resData });
        } catch (err) {
            throw err;
        }
    };
};

export const postcomment = (groupid,body,type) => {
    return async (dispatch, getState) => {
        const response = await fetch(
            global.API_URL + '/comments/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
                body: JSON.stringify({
                    group: groupid,
                    body: body,
                    type: type
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.message;
            throw new Error(errorId);
        }

        const resData = await response.json();
        dispatch({ type: POSTCOMMENT,postedcomment: resData });
    }
};