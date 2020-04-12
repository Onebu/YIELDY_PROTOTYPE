import { FETCHGROUPCOMMENTS, FETCHRELATEDCOMMENTS,POSTCOMMENT } from '../actions/comment';

const initialState = {
    relatedComments: [],
    groupComments: [],
    postedComment: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHRELATEDCOMMENTS:
            return {
                ...state,
                relatedComments: action.relatedComments
            };
        case FETCHGROUPCOMMENTS:
            return {
                ...state,
                groupComments:action.groupComments
            };
        case POSTCOMMENT:
            return {
                ...state,
                postedComment: action.postedComment
            };  
        default:
            return state;
    }

    return state;
};