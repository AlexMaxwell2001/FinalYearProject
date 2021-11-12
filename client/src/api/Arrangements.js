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
   
const newArrangement = (id, arrangement) => {
    return post('add/', {id, arrangement})
}

const loadArrangements = () => {
    return get();
}

const getArrangement = (id) => {
    return get('get/' + id)
}

const saveArrangement = (id, config) => {
    return post('update/' + id, {id, config})
}

const deleteArrangement = (id) => {
    return post('delete/' + id, {id})
}

export {
    newArrangement,
    loadArrangements,
    getArrangement,
    saveArrangement,
    deleteArrangement
}