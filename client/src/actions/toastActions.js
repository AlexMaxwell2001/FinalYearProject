const addMessage = (message) => dispatch => {
  dispatch({
    type: "ADD_MESSAGE",
    payload: {
      message
    }
  })
};

const removeMessage = (id) => dispatch => {
  dispatch({
    type: "REMOVE_MESSAGE",
    payload: {
      id
    }
  })
};

export {
  addMessage,
  removeMessage
}