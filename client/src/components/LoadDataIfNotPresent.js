import React, { useEffect } from 'react';
import { loadCards } from "../api/CardsAPI"
import { connect } from "react-redux";
import { addMessage } from '../actions/toastActions';
import { setCards } from '../actions/cardActions';

function LoadDataIfNotPresent(props) {
    const {cards, auth, setCards, addMessage} = props
    useEffect(_ => {
        if (!cards.cards) {
            loadCards(auth.user.id)
                .then(res => {
                    let data = res.data.allCards;
                    setCards(data);
                })
                .catch(_ => {
                    addMessage({ message: "Error loading cards", type: 2 })
                })
        }
    }, [])
    return <React.Fragment>
        {props.children}
    </React.Fragment>
}

const mapStateToProps = state => ({
    auth: state.auth,
    cards: { ...state.cards },
});


export default connect(
    mapStateToProps,
    { addMessage, setCards }
)(LoadDataIfNotPresent);
