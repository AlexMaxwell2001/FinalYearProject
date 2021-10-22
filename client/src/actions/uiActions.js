const closeDrawer = () => dispatch => {
    dispatch({
      type: "CLOSE_DRAWER",
      payload: null
    })
  };
  
  const openDrawer = () => dispatch => {
    dispatch({
      type: "OPEN_DRAWER",
      payload: null
    })
  };

  const toggleDrawer = () => dispatch => {
    dispatch({
      type: "TOGGLE_DRAWER",
      payload: null
    })
  };
  
  export {
    closeDrawer,
    openDrawer,
    toggleDrawer
  }