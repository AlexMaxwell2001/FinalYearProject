export const setArrangement = arrangement => {
    return {
      type: "SET_ARRANGEMENT",
      payload: arrangement
    };
  };


  export const removeCard = index => {
    return {
      type: "REMOVE_CARD",
      payload: index
    };
  };


  export const updateGridValue = (index, ref, value) => {
    return {
      type: "UPDATE_GRID_VALUE",
      payload: {index, ref,value}
    }
  }

  export const updateColSpacing = (value) => {
    return {
      type: "SET_CONFIG_VALUE",
      payload: {
        ref: "col_spacing", value
      }
    }
  }

  export const updateRowSpacing = (value) => {
    return {
      type: "SET_CONFIG_VALUE",
      payload: {
        ref: "row_spacing", value
      }
    }
  }

  export const updateMinWidth = (value) => {
    return {
      type: "SET_CONFIG_VALUE",
      payload: {
        ref: "min_width", value
      }
    }
  }

  export const setResponsive = (value) => {
    return {
      type: "SET_CONFIG_VALUE",
      payload: {
        ref: "responsive", value
      }
    }
  }


  export const updateType = arrangementType => {
    return {
      type: "UPDATE_ARRANGMENT_TYPE",
      payload: {arrangementType}
    };
  };

  export const updateTitle = title => {
    return {
      type: "UPDATE_ARRANGMENT_TITLE",
      payload: {title}
    };
  };
  
  export const switchSet = (set) => {
    return {
      type: "SWITCH_SET",
      payload: set
    };
  };

  export const setUnsaved = () => {
    return {
      type: "SET_ARRANGEMENT_SAVED",
      payload: {saved: false}
    };
  }

  export const resetCards = () => {
    return {
      type: "RESET_CARDS",
      payload: null
    };
  };

  export const resetArrangements = () => {
    return {
      type: "RESET_ARRANGEMENTS",
      payload: null
    };
  };

  export const addCard = card => {
    return {
      type: "NEW_CARD",
      payload: card
    };
  };
