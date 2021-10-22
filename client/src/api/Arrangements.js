import axios from "axios";

const get = (apiRoute) => {
    return new Promise((resolve, reject) => {
        axios.get(('/arrangements/' + apiRoute))
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
    });
};

const post = (apiRoute, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: '/arrangements/' + apiRoute,
            data: { ...payload }
          })
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
    });
}
   

export const newArrangement = (id, arrangement) => {
    return post('add/', {id, arrangement})
}

export const loadArrangements = (userID) => {
    return get(userID);
}

export const getArrangement = (id) => {
    return get('get/' + id)
}

export const saveArrangement = (id, config) => {
    return post('update/' + id, {id, config})
}

export const deleteArrangement = (id) => {
    return post('delete/' + id, {id})
}