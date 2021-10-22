function initState(){ //INITIAL USER DATA
	return {
        unsaved: false
    }
}
/*
Set Cards
Update Card
Delete Card
*/


export default function (state = initState(), action) {
    let newState;
    let index, value, ref;
    switch (action.type) {
        case "SET_ARRANGEMENT_SAVED":
            let saved = action.payload.saved
            newState = state;
            newState.unsaved = saved;
            return {...newState}
            case "SET_CONFIG_VALUE":
                ref = action.payload.ref
                value = action.payload.value
                newState = state;
                newState.config[0][ref] = value;
                return {...newState, unsaved:true}
        case "UPDATE_ARRANGMENT_TITLE":
            let title = action.payload.title;
            newState = state;
            newState.config[0].name = title;
            return {...newState, unsaved:true};
            case "UPDATE_GRID_VALUE":
                index = action.payload.index;
                ref = action.payload.ref;
                value = action.payload.value;
                newState = state;
                if(!newState.config[0].grid)
                    newState.config[0].grid = []
                let found = false;
                newState.config[0].grid = newState.config[0].grid.map((gridOption) => {
                    if(gridOption.id === index) {
                        found = true;
                        return {...gridOption, [ref] : value}
                    }
                    else return gridOption;
                })
                if(!found)
                    newState.config[0].grid.push({id: index, [ref]: value})
                return {...newState, unsaved:true};
            case "UPDATE_ARRANGMENT_TYPE":
                let arrangementType = action.payload.arrangementType;
                newState = state;
                newState.config[0].arrangementType = arrangementType;
                return {...newState, unsaved:true};
        case "SWITCH_SET":
            let set = action.payload;
            newState = state;
            newState.config[0].cardSet = action.payload._id;
            newState.config[0].grid = []
            if(newState.set === null) {
                return {...newState, set: [action.payload]}
            }
            newState.set[0] = set;
            return {...newState, unsaved:true}
        case "SET_ARRANGEMENT":
            let arrangement = action.payload;
            newState = state;
            newState  = {...arrangement};
            return {...newState, ...state}
            case "RESET_ARRANGEMENTS":
                return initState();
        default:
            return state;
    }
}