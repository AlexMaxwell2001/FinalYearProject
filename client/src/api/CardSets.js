import axios from "axios";

const get = (apiRoute) => {
    return new Promise((resolve, reject) => {
        axios.get(('/sets/' + apiRoute))
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
            url: '/sets/' + apiRoute,
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

  

const saveSet = (id, card) => {
    return post('update/' + id, {id, card})
}

const deleteSet = (id) => {
    return post('delete/' + id, {id})
}

const copySet = (id, set) => {
    let newSet = set;
    set.createdBy = id;
    set.visibility = "private";
    set.createdAt = Date.now();
    set.updatedAt = Date.now();
    delete newSet._id;
    return post('add/', {id, set})
}

const newSet = (id, set) => {
    return post('add/', {id, set})
}

const getSet = (id) => {
    return get('get/' + id)
}


const loadSets = (userID) => {
    return get(userID);
}


export {
    loadSets,
    deleteSet,
    newSet,
    saveSet,
    getSet,
    copySet
}