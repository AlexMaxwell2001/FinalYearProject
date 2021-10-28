import axios from "axios";

const get = (apiRoute) => {
    return new Promise((resolve, reject) => {
        axios.get(('/cardsV2/' + apiRoute))
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
            url: '/cardsV2/' + apiRoute,
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

const rootCard = (card, title) => {
    let newCard = card;
    newCard.createdBy = "root"
    newCard.name = title
    newCard.visibility = "public"
    return addCard("root", newCard)
}

  

const updateCard = (id, card) => {
    return post('update/' + id, {id, card})
}

const deleteCard = (id) => {
    return post('delete/' + id, {id})
}

const addCard = (id, card) => {
    return post('add/', {id, card})
}

const getCard = (id) => {
    return get('get/' + id)
}


const loadCards = () => {
    return get();
}


export {
    loadCards,
    deleteCard,
    addCard,
    updateCard,
    getCard,
    rootCard
}