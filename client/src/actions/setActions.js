export const addToSet = (card) => dispatch => {
    dispatch({
      type: "ADD_TO_SET",
      payload: {card}
    })
};

export const setTags = (tags) => dispatch => {
  dispatch({
    type: "SET_TAGS",
    payload: {tags}
  })
};

export const setUnsaved = () => {
  return {
    type: "SET_SAVED",
    payload: {saved: false}
  };
}

export const removeCard = (cardId) => dispatch => {
  dispatch({
    type: "REMOVE_FROM_SET",
    payload: {cardId}
  })
};

export const setText = (cardId, styleId, text) => dispatch => {
  dispatch({
    type: "SET_TEXT",
    payload: {cardId, styleId, text}
  })
};


export const resetState = () => dispatch => {
  dispatch({
    type: "RESET_SET_STATE",
    payload: null
  })
};

export const setDescription = (description) => dispatch => {
  dispatch({
    type: "UPDATE_SET_VALUE",
    payload: {
      ref: "description",
      value: description
    }
  })
};

export const flipCard = (index, flipped) => dispatch => {
  dispatch({
    type: "SET_FLIPPED",
    payload: {
      index, flipped
    }
  })
};

export const updateContainerStyle = (ref, value) => dispatch => {
  dispatch({
    type: "UPDATE_CONTAINER_STYLE",
    payload: {
      ref,value
    }
  })
};

export const setVisibility = (visibility) => dispatch => {
  dispatch({
    type: "UPDATE_SET_VALUE",
    payload: {
      ref: "visibility",
      value: visibility
    }
  })
};

export const setName = (name) => dispatch => {
  dispatch({
    type: "UPDATE_SET_VALUE",
    payload: {
      ref: "name",
      value: name
    }
  })
};


export const updateSet = (set) => dispatch => {
  dispatch({
    type: "UPDATE_SET_STATE",
    payload: {set}
  })
};

