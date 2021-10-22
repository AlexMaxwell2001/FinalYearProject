import { GET_ERRORS } from "../actions/types";
const initialState = {
  messages: [

  ]
};

export default function (state = initialState, action) {
  let new_msg;
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case "ADD_MESSAGE":
      new_msg = state.messages;
      new_msg = ([{ ...action.payload.message }])
      return { messages: new_msg };
    case "REMOVE_MESSAGE":
      new_msg = state.messages;
      new_msg.splice((m, index) => index === action.payload.id)
      return { messages: new_msg };
      case "REMOVE_ALL_MESSAGES":
        new_msg = state.messages;
        new_msg = []
        return { messages: new_msg };
    default:
      return state;
  }
}