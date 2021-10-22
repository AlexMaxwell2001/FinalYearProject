import { combineReducers } from "redux";
import authReducer from "./authReducer";
import cardsReducer from "./cardsReducer";
import editorReducer from "./editorReducer";
import errorReducer from "./errorReducer";
import setReducer from "./setReducer";
import arrangementReducer from "./arrangeReducer";
import uiReducer from "./uiReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  styles: editorReducer,
  sets: setReducer,
  cards: cardsReducer,
  arrangements: arrangementReducer,
  ui: uiReducer
});