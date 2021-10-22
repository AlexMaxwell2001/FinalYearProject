import ui from './uiReducer'
const initialState = {
    drawerOpen: false
  };

describe('REDUCER - UI', () => {
	it('should return initial state with wrong type',()=>{
		const sampleState = initialState
		const state = ui(undefined, {type:'WRONG_TYPE'})
		expect(state).toEqual(sampleState);
	})
});



