var undo=[];
let redo=[];
const initialState = {
    editingStyleIndex: { id: -1, face: "front" },
    flipped: false,
    unsaved: false
};

function getUndo(){
    if(undo.length===0)return true;
    return false
}

function getRedo(){
    if(redo.length===0)return true;
    return false
}

export default function (state = initialState, action) {
    let newState;
    let index, front, type, value, ref;
    if( (JSON.stringify(state).includes("back"))){
        if(action.type !== "UNDO" && action.type !== "SET_EDITING_STYLE" && action.type !== "REDO" && action.type !== 'UPDATE_EDITOR_STATE' && action.type !== "RESET_EDITOR_STATE" && action.type !== "TOGGLE_DRAWER" && action.type !== "CLOSE_DRAWER"){
            undo.push(JSON.parse(JSON.stringify(state)));
        }
    }
    switch (action.type) {
        case "UPDATE_EDITOR_STATE":
            return { ...state, ...action.payload }
        case "RESET_EDITOR_STATE":
            undo=[];
            redo=[];
            return initialState
        case "UPDATE_STYLE":
            let { styles } = action.payload;
            index = action.payload.index;
            front = action.payload.front;
            newState = state;
            type = front;
            newState[type].styles[index].data = {
                ...newState[type].styles[index].data,
                styles: {
                    ...newState[type].styles[index].data.styles,
                    ...styles
                }
            }
            return { ...newState, unsaved: true };
        case "UPDATE_ADVANCED_STYLE":
            let { advancedStyles } = action.payload;
            index = action.payload.index;
            front = action.payload.front;
            newState = state;
            type = front;
            if (!newState[type].styles[index].data.advancedStyles) {
                newState[type].styles[index].data = {
                    ...newState[type].styles[index].data,
                    advancedStyles: {
                        ...advancedStyles
                    }
                }
            } else {
                newState[type].styles[index].data = {
                    ...newState[type].styles[index].data,
                    advancedStyles: {
                        ...newState[type].styles[index].data.advancedStyles,
                        ...advancedStyles
                    }
                }
            }
            return { ...newState, unsaved: true };
        case "DELETE_ADVANCED_STYLE":
            let { styleName } = action.payload;
            index = action.payload.index;
            front = action.payload.front;
            newState = state;
            type = front;
            delete newState[type].styles[index].data.advancedStyles[styleName]
            return { ...newState, unsaved: true };
        case "CARD_SET_VALUE":
            ref = action.payload.ref;
            value = action.payload.value;
            newState = state;
            newState[ref] = value
            return { ...newState, unsaved: true };
        case "UPDATE_FIXED_CONTENT":
            let { values, content } = action.payload;
            content = action.payload.content;
            newState = state;
            newState[content] = {
                ...newState[content],
                ...values
            }
            return { ...newState, unsaved: true };
        case "SET_EDITING_STYLE":
            index = action.payload.index
            newState = state;
            newState.editingStyleIndex = index;
            return { ...newState };
        case "EDITOR_SET_VALUE":
            value = action.payload.value;
            ref = action.payload.ref;
            content = action.payload.content;
            newState = state;
            newState[ref] = value
            let unsaved = ref === "unsaved" ? false : true
            return { ...newState, unsaved };
        case "UPDATE_BODY":
            let { style } = action.payload
            console.log("here")
            newState = state;
            newState.body = {
                ...newState.body,
                ...style
            }
            return { ...newState, unsaved: true };
        case "ADD_CONTENT":
            content = action.payload.content;
            newState = state;
            front = action.payload.front;
            type = front ? "front" : "back"
            newState[type].styles.push(content);
            return {
                ...newState, unsaved: true
            };
        case "REMOVE_CONTENT":
            index = action.payload.index;
            front = action.payload.front;
            newState = state;
            type = front
            newState[type].styles.splice(index, 1);
            return {
                ...newState, unsaved: true
            };
        case "UNDO":
            var temp1= undo.pop()
            redo.push(state)
            return {
                ...temp1, unsaved: true
            };
        case "REDO":
            var temp2= redo.pop();
            undo.push(state)
            return {
                ...temp2, unsaved: true
            };
        case "TOGGLE_OPTION":
            let option = action.payload.option;
            newState = state;
            newState[option] = !newState[option]
            return {
                ...newState, unsaved: true
            };
        case "SWAP_CONTENT":
            let { index1, index2 } = action.payload;
            front = action.payload.front;
            type = front
            if (index1 < 0 || index2 < 0 || index1 >= state[type].styles.length || index2 >= state[type].styles.length) {
                return { ...state };
            }
            newState = state;
            let old = newState[type].styles[index1];
            newState[type].styles[index1] = newState[type].styles[index2]
            newState[type].styles[index2] = old;
            return {
                ...newState, unsaved: true
            };
        default:
            return state;
    }

}

export {
    getUndo,
    getRedo,
}
