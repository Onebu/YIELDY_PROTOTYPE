import {
    FETCHGROUP,
    CREATEGROUP,
    FETCHGROUPBYID,
    FETCHGROUPSERVER,
    FETCHGROUPPARTICIPANTS,
    ADDMEMBER,
    REMOVEMEMBER,
    SEARCHUSERBYNAME
} from '../actions/group';

const initialState = {
    groups: [],
    currentGroup: null,
    groupServerList: [],
    groupParticipants: [],
    patchStatus: null,
    searchedUser: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCHGROUP:
            return {
                ...state,
                groups: action.userGroup
            };
        case CREATEGROUP:
            return {
                ...state,
                groups: [...state.groups, action.createGroup]
            };
        case FETCHGROUPBYID:
            return {
                ...state,
                currentgroup: action.currentGroup
            };
        case FETCHGROUPSERVER:
            return {
                ...state,
                groupServerList: action.groupServerList
            };
        case FETCHGROUPPARTICIPANTS:
            return {
                ...state,
                groupParticipants: action.groupParticipants
            };
        case ADDMEMBER:
            return {
                ...state,
                patchStatus: action.patchStatus
            };
        case REMOVEMEMBER:
            return {
                ...state,
                patchStatus: action.patchStatus
            };
        case SEARCHUSERBYNAME:
            return {
                ...state,
                searchedUser: [action.searchedUser]
            };
        default:
            return state;
    }

    return state;
};