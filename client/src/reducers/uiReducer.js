const initialState = {
  drawerOpen: false
};

export default function (state = initialState, action) {
  let newState;
  switch (action.type) {
    case "OPEN_DRAWER":
        newState = state;
        newState.drawerOpen = true;
        return {...newState}
        case "CLOSE_DRAWER":
            newState = state;
            newState.drawerOpen = false;
            return {...newState}
            case "TOGGLE_DRAWER":
            newState = state;
            newState.drawerOpen = !state.drawerOpen;
            return {...newState}
    default:
      return state;
  }
}