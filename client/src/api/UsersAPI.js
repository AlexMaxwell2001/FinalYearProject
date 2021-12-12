import axios from "axios";

const get = (apiRoute) => {
    return new Promise((resolve, reject) => {
        axios.get(('/api/users/' + apiRoute))
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
    });
};


const loadUsers = () => {
    return get();
}


export {
    loadUsers, 
}