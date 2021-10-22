const initialState = {
    unsaved: false,
    editingCardIndex: -1,
    container: {

    }
};


export default function (state = initialState, action) {
    let newState;
    let index, value, ref;
    switch (action.type) {
        case "SET_SAVED":
            let saved = action.payload.saved
            newState = state;
            newState.unsaved = saved;
            return {...newState}
        case "ADD_TO_SET":
            let card = action.payload.card;
            let cards = state.cards;
            cards.push(card);
            return { ...state, cards, unsaved: true }
            case "REMOVE_FROM_SET":
                let id = action.payload.cardId;
                newState = state;
                newState.cards.splice(id, 1);
                return { ...newState , unsaved: true }
                case "SET_FLIPPED":
                    index = action.payload.index;
                    let flipped = action.payload.flipped;
                    newState = state;
                    newState.cards[index].flipped = flipped;
                    return { ...newState }
            case "SET_TAGS":
                let tags = action.payload.tags;
                return { ...state, tags, unsaved: true }
                case "SET_TEXT":
                    let newCards = state.cards
                    let {cardId, styleId, text} = action.payload;
                    if(!newCards[cardId].flipped)
                        newCards[cardId].front.styles[styleId].data.styles.text = text;
                    else
                        newCards[cardId].back.styles[styleId].data.styles.text = text;
                    return { ...state, cards:newCards, unsaved: true }
                case "UPDATE_SET_VALUE":
                    ref = action.payload.ref; //object name
                    value = action.payload.value; //object value
                    newState = state;
                    state[ref] = value;
                    return {...newState, unsaved: true}
                    case "UPDATE_CONTAINER_STYLE":
                        ref = action.payload.ref; //object name
                        value = action.payload.value; //object value
                        newState = state;
                        state.container[ref] = value;
                        return {...newState, unsaved: true}
                case "UPDATE_SET_STATE":
                    newState = action.payload.set;
                    return { ...state, ...newState}
        case "RESET_SET_STATE":
            return initialState
        default:
            return state;
    }
}