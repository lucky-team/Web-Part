import ProfileTypes from 'redux/actions/profile/ProfileTypes.jsx';
import { baseUrl } from 'routes/BaseUrl.jsx';
import { CatchCodes } from 'redux/actions/settings.jsx';
import { enqueueSnackbar } from 'redux/actions/notification/notification.jsx';

// ******* fetch profile *******

export const requestFetchProfile = () => {
    return {
        type: ProfileTypes.FETCH_PROFILE_REQUEST
    }
}

export const receiveSelfProfile = (profile) => {
    return {
        type: ProfileTypes.FETCH_SELF_PROFILE_SUCCESS,
        profile: profile
    }
}

export const fetchSelfProfileError = (err) => {
    return {
        type: ProfileTypes.FETCH_SELF_PROFILE_FAILURE,
        err: err
    }
}

export const receiveProfiles = (profiles) => {
    return {
        type: ProfileTypes.FETCH_PROFILES_SUCCESS,
        profiles: profiles
    }
}

export const fetchProfileError = (err) => {
    return {
        type: ProfileTypes.FETCH_PROFILES_FAILURE,
        err: err
    }
}

export const fetchProfiles = (query) => (dispatch) => {
    dispatch(requestFetchProfile());

    let url = baseUrl + 'profiles';
    if (query) {
        url += query;
    }
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': bearer
        }
    })
    .then(response => {
        if (CatchCodes.indexOf(response.status) >= 0) {
            return response;
        } else {
            let error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }
    })
    .then(response => response.json())
    .then(response => {
        if (query) {
            // TODO profiles on employees side
        } else {
            if (Array.isArray(response)) {
                dispatch(receiveSelfProfile(response.length ? response[0] : response));
                if (response.length) {
                    dispatch(receiveSelfProfile(response[0]));
                } else {
                    dispatch(receiveSelfProfile(response));
                    enqueueSnackbar({
                        message: 'tips',
                        options: {
                            variant: 'warning',
                        },
                        field: 'profilePage'
                    });
                }
            } else {
                let error = new Error(`Error ${response.status}: ${response.statusText}`);
                error.response = response;
                throw error;
            }
        }
    })
    .catch(err => dispatch(query ?
        fetchProfileError(err.message)
        :
        fetchSelfProfileError(err.message)));
}

// ******* create profile *******

export const requestCreateProfile = () => {
    return {
        type: ProfileTypes.CREATE_PROFILE_REQUEST
    }
}

export const receiveCreateProfile = (response) => {
    return {
        type: ProfileTypes.CREATE_PROFILE_SUCCESS,
        msg: response.msg,
        profile: response.profile
    }
}

export const createProfileError = (err) => {
    return {
        type: ProfileTypes.CREATE_PROFILE_FAILURE,
        err: err
    }
}

export const createProfile = (profile) => (dispatch) => {
    dispatch(requestCreateProfile());

    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'profiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(profile)
    })
    .then(response => {
        if (CatchCodes.indexOf(response.status) >= 0) {
            return response;
        } else {
            let error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            dispatch(receiveCreateProfile(response));
            dispatch(enqueueSnackbar({
                message: response.msg,
                options: {
                    variant: 'success',
                },
                field: 'actions.profile'
            }));
        } else {
            dispatch(createProfileError(`${response.err.name}: ${response.err.message}`));
            dispatch(enqueueSnackbar({
                message: `${response.err.name}: ${response.err.message}`,
                options: {
                    variant: 'error',
                },
                field: 'actions.profile'
            }));
        }
    })
}

// ******* update profile *******

export const requestUpdateProfile = () => {
    return {
        type: ProfileTypes.UPDATE_PROFILE_REQUEST
    }
}

export const receiveUpdateProfile = (response) => {
    return {
        type: ProfileTypes.UPDATE_PROFILE_SUCCESS,
        msg: response.msg,
        profile: response.profile
    }
}

export const updateProfileError = (err) => {
    return {
        type: ProfileTypes.UPDATE_PROFILE_FAILURE,
        err: err
    }
}

export const updateProfile = (profile) => (dispatch) => {
    dispatch(requestUpdateProfile());

    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'profiles', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(profile)
    })
    .then(response => {
        if (CatchCodes.indexOf(response.status) >= 0) {
            return response;
        } else {
            let error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            dispatch(receiveUpdateProfile(response));
            dispatch(enqueueSnackbar({
                message: response.msg,
                options: {
                    variant: 'success',
                },
                field: 'actions.profile'
            }));
        } else {
            dispatch(updateProfileError(`${response.err.name}: ${response.err.message}`));
            dispatch(enqueueSnackbar({
                message: `${response.err.name}: ${response.err.message}`,
                options: {
                    variant: 'error',
                },
                field: 'actions.profile'
            }));
        }
    })
    .catch(err => dispatch(updateProfileError(err.message)));
}