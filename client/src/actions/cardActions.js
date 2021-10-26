export const setCards = cards => {
    return {
      type: "SET_CARDS",
      payload: cards
    };
  };

  export const saveCard = (id, card) => {
    return {
      type: "UPDATE_P_CARD",
      payload: {card, id}
    };
  }

  export const setCardVisibility = (visibility) => dispatch => {
    dispatch({
      type: "UPDATE_CARD_VALUE",
      payload: {
        ref: "visibility",
        value: visibility
      }
    })
  };


  export const removeCard = index => {
    return {
      type: "REMOVE_CARD",
      payload: index
    };
  };

  export const resetCards = () => {
    return {
      type: "RESET_CARDS",
      payload: null
    };
  };

  export const addCard = card => {
    return {
      type: "NEW_CARD",
      payload: card
    };
  };
