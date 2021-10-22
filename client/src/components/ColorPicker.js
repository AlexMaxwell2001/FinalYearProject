

import React from 'react';
import { SketchPicker } from 'react-color';
export default class ColorPicker extends React.Component {
    state = {
        showPicker: false
    }
    constructor(props){
        super(props);
        this.ref = React.createRef();
    }
    renderColorTTBox(color) {
        return <div style={{width:"fit-content"}} className="colorBox">
            <span onClick = {e=>this.toggleTTColor()} style = {{display:"block", backgroundColor: color, width:25, height:25}}></span>
            </div>
    }
    toggleTTColor(){
        if(!this.state.showPicker && this.ref) {
            this.setState({showPicker: !this.state.showPicker})
				setTimeout(() => {
					this.ref.current.focus();
				}, 100);
		}	
    }
    onBlur = () => {
		setTimeout(() => {
			this.setState({showPicker: false});
		}, 200);
	}
    render() {
        let {color} = this.props;
        return <div style={{position:"relative"}}>
                {this.renderColorTTBox(color)}
                {this.state.showPicker && <div style = {{top: -100, zIndex:10}} tabIndex="0" ref = {this.ref} onBlur = {this.onBlur} ><SketchPicker disableAlpha={false} className = "absolute" color = {color} onChangeComplete={ color => {
                       this.props.onColorChange(color.hex);
                } }/></div>}
            </div>
    }
}