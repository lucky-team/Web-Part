import ClaimTypes from 'redux/actions/claim/ClaimTypes.jsx';
import { baseUrl } from 'routes/BaseUrl.jsx';
import { CatchCodes } from 'redux/actions/settings.jsx';
import axios from 'axios';

// ******* create claim *******

export const requestFileClaim = () => {
    return {
        type: ClaimTypes.FILE_CLAIMS_REQUEST
    }
}

export const receiveFileClaim = (msg) => {
    return {
        type: ClaimTypes.FILE_CLAIMS_SUCCESS,
        msg: msg
    }
}

export const fileClaimError = (err) => {
    return {
        type: ClaimTypes.FILE_CLAIMS_FAILURE,
        err: err
    }
}

export const fileClaim = (claim) => (dispatch) => {
    dispatch(requestFileClaim());

    const date = claim['date'].toISOString();
    claim['date'] = date;
    var formdata = new FormData();
    let id = 0;
    Array.from(claim['files']).forEach((file) => {
        id++;
        formdata.append(String(id), file);
    });
    delete claim['files'];
    for (var name in claim) {
        formdata.append(name, claim[name]);
    }

    const bearer = 'Bearer ' + localStorage.getItem('token');
    return axios.post(baseUrl + 'claims', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
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
    .then(response => response.data)
    .then(response => {
        if (response.success) {
            dispatch(receiveFileClaim(response.msg));
        } else {
            dispatch(fileClaimError(`${response.err.name}: ${response.err.message}`))
            dispatch(fileClaimError(`${response.err.name}: ${response.err.message}`))
        }
    })
    .catch(err => dispatch(fileClaimError(err.message)));
}

// ******* fetch claims *******

export const requestFetchClaims = () => {
    return {
        type: ClaimTypes.FETCH_CLAIMS_REQUEST
    }
}

export const receiveFetchClaims = (claims) => {
    return {
        type: ClaimTypes.FETCH_CLAIMS_SUCCESS,
        claims: claims
    }
}

export const fetchClaimsError = (err) => {
    return {
        type: ClaimTypes.FETCH_CLAIMS_FAILURE,
        err: err
    }
}

export const fetchClaims = (query) => (dispatch) => {
    dispatch(requestFetchClaims());

    let url = baseUrl + 'claims';
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
            // TODO claims on employees side
        } else {
            if (Array.isArray(response)) {
                dispatch(receiveFetchClaims(response));
            } else {
                dispatch(fileClaimError(`${response.err.name}: ${response.err.message}`))
            }
        }
    })
    .catch(err => dispatch(fetchClaimsError(err.messsage)));
}