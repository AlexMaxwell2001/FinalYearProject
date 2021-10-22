import { addCard } from "../api/CardsAPI";
import { addMessage } from "./toastActions";

// Register User
const updateStyle = (cardId, front, index, styles) => dispatch => {
      dispatch({
        type: "UPDATE_STYLE",
        payload: {cardId, front, index, styles}
      })
};

const updateAdvancedStyle = (cardId, front, index, advancedStyles) => dispatch => {
  dispatch({
    type: "UPDATE_ADVANCED_STYLE",
    payload: {cardId, front, index, advancedStyles}
  })
};

const removeContent = (cardId, front, index) => dispatch => {
    dispatch({
      type: "REMOVE_CONTENT",
      payload: {cardId, front, index}
    })
};

const undoContent = () => dispatch => {
  dispatch({
    type: "UNDO",
    payload:{}
  })
};

const redoContent = () => dispatch => {
  dispatch({
    type: "REDO",
    payload:{}
  })
};

const deleteAdvanced = (cardId, front, index, styleName) => dispatch => {
  dispatch({
    type: "DELETE_ADVANCED_STYLE",
    payload: {cardId, front, index, styleName}
  })
};

const toggleOption = (cardId, option) => dispatch => {
  dispatch({
    type: "TOGGLE_OPTION",
    payload: {cardId, option}
  })
};

const updateTitle = (label) => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "name",
      value : label
    }
  })
};

const updateCardTitle = (cardId, label) => dispatch => {
  dispatch({
    type: "CARD_SET_VALUE",
    payload: {
      ref: "name",
      value : label,
      cardId
    }
  })
};

const updateSetTitle = (label) => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "name",
      value : label,
    }
  })
};
const updateSetDescription = (description) => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "description",
      value : description,
    }
  })
};

const updateBody = (cardId, style) => dispatch => {
  dispatch({
    type: "UPDATE_BODY",
    payload: {cardId, style}
  })
};


const updateFixedContent = (cardId, front, content, values) => dispatch => {
  dispatch({
    type: "UPDATE_FIXED_CONTENT",
    payload: {cardId, content, values, front}
  })
};


const resetEditorState = () => dispatch => {
  dispatch({
    type: "RESET_EDITOR_STATE",
    payload: null
  })
};



const addCardToSet = (name) => dispatch => {
  const defaultCard = {
    name,
    backEnabled: false,
    frontTrigger: { id:  0  },
    backTrigger:  { id:  0  },
    body: {
        backgroundColor: "white",
        borderRadius: '25px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px, rgba(0, 0, 0, 0.2) 0px 1px 5px 0px',
    },
    front: {
      styles: [
        getContentData('Title')
      ]
    },
    back: {
      styles: [
        getContentData('Title')
      ]
    } 
  }
  dispatch({
    type: "ADD_CARD_TO_SET",
    payload: {
      card: defaultCard
    }
  })
}

const newCardWithTemplate = (card, title, description, uuid) => dispatch => {
  let newCard = card;
  newCard.description = description;
  newCard.name = title;
  newCard.createdBy = uuid;
  addCard(uuid, newCard)
    .then(res => {
      dispatch(addMessage({message: "Card Created Successfully!", type: 1}))
      dispatch(SelectTemplate(res.data.updated))
      return res.data.updated._id;
    })
    .catch(err =>   dispatch(addMessage({message: err, type: 1})))
}

const newCard = (title, visibility, uuid) => dispatch => {
  const defaultCard = {
    template: title,
    name: title,
    label: title,
    cardSet: title,
    createdBy: uuid,
    description: "ss",
    tags: [],
    visibility,
    activeFlag: '1',
    backEnabled: false,
    gridEnabled: false,
    frontTrigger: { id:  0  },
    backTrigger:  { id:  0  },
    container: {
      backgroundColor: "transparent",
    },
    cards: [],
    body: {
        backgroundColor: "white",
        maxWidth: '200px',
        borderRadius: '25px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        minHeight: '100px',
        boxShadow: 'rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px, rgba(0, 0, 0, 0.2) 0px 1px 5px 0px',
    },
    front: {
      styles: [
        getContentData('Title')
      ]
    },
    back: {
      styles: [
        getContentData('Title')
      ]
    } 
  }
  addCard(uuid, defaultCard)
    .then(_ => dispatch(addMessage({message: "Card Created Successfully!", type: 1})))
    .catch(err =>   dispatch(addMessage({message: err, type: 1})))
  dispatch(SelectTemplate(defaultCard))
}

const SelectTemplate = (state) => dispatch => {
  dispatch({
    type: "UPDATE_EDITOR_STATE",
    payload: {...state}
  })
};

const flipCard = (cardId, flipped) => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "flipped",
      value : flipped
    }
  })
};

const setFlipDirection = (direction) => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "flipDirection",
      value : direction
    }
  })
};


const setFlipTrigger = (cardId, front, values) => dispatch => {
  dispatch({
    type: "UPDATE_FIXED_CONTENT",
    payload: {
      cardId,
      content: front ? "frontTrigger" : "backTrigger",
      values : {id : values},
      front}
  })
};

const swapContent = (cardId, front, index1, index2) => dispatch => {
    dispatch({
      type: "SWAP_CONTENT",
      payload: {cardId, front, index1, index2}
    })
};


 function getContentData(name) {
    switch(name) {
        case "Title":
            return {
                data: {
                  name,
                  styles: {
                    color: "black",
                    textAlign: "center",
                    width:"",
                    margin: 0,
                    fontFamily:"",
                    display:"block",
                    backgroundColor:"",
                    borderRadius:"",
                    boxShadow:"",
                    text: 'Title'
                  },
                  advancedStyles: {}
                }
              }
        case "Paragraph 1":
            return {
                data: {
                  name,
                  styles: {
                    borderRadius: "2",
                    text: name
                  },
                  advancedStyles: {}
                }
              }
        case "Paragraph 2":
            return {
                data: {
                  name,
                  styles: {
                    borderRadius: "2",
                    text: name
                  }
                }
              }
        case "Paragraph 3":
            return {
                data: {
                  name: "Paragraph 3",
                  styles: {
                    borderRadius: "2",
                    text: 'test'
                  }
                }
              }
              case "Button":
                return {
                    data: {
                      name,
                      styles: {
                        border:"none",
                        borderRadius: "5px",
                        width: "100px",
                        height: "42px",
                        color: 'white',
                        margin: "10px 0px 10px 0px",
                        backgroundColor: '#2979FF',
                        text: name
                      },
                    }
                  }
                  case "Image":
                    return {
                        data: {
                          name,
                          styles: {
                              width:'100px',
                              backgroundSize: '100px',
                              height:'100px',
                            borderRadius: "2",
                            backgroundRepeat: "no-repeat",
                            backgroundImage: "url('https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image-620x600.jpg')",
                          },
                        }
                      }
        default: 
            return {
                data: {
                name,
                styles: {
                  borderRadius: 2,
                  text: name
                },
              }
            }
        
    }
}
const addContent = (cardId, front, index, name) => dispatch => {
    dispatch({
      type: "ADD_CONTENT",
      payload: {cardId, front, index, content:getContentData(name)}
    })
};


const cloneCard = (index) => dispatch => {
  dispatch({
    type: "CLONE_CARD",
    payload: {index}
  })
};

const setSaved = () => dispatch => {
  dispatch({
    type: "EDITOR_SET_VALUE",
    payload: {
      ref: "unsaved",
      value : false
    }
  })
};

const setEditingStyle = (index) => dispatch => {
  dispatch({
    type: "SET_EDITING_STYLE",
    payload: {index}
  })
};




export {
    redoContent,
    undoContent,
    addContent,
    newCard,
    updateStyle,
    getContentData,
    removeContent,
    setFlipDirection,
    cloneCard,
    swapContent,
    updateFixedContent,
    updateSetTitle,
    newCardWithTemplate,
    setSaved,
    updateSetDescription,
    updateCardTitle,
    updateTitle,
    toggleOption,
    resetEditorState,
    updateAdvancedStyle,
    setFlipTrigger,
    SelectTemplate,
    flipCard,
    updateBody,
    setEditingStyle,
    deleteAdvanced,
    addCardToSet
}

