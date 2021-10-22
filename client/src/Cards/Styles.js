import React from 'react';
import 'materialize-css';
import {
  Row,
  Button,
  Col,
  TextInput,
  Icon,
  Textarea,
  Select,
} from 'react-materialize';
import {ShadowPicker} from "react-shadow-picker";
import ColorPicker from '../components/ColorPicker';


function validateStyle(styleValue) {
    if (styleValue === undefined)
      return "";
    else if (!isNaN(styleValue)) { // error if they forget "px" after number
      return `${styleValue}` // stringify style (number)
    }
    else return styleValue;
  }
  
export function BackgroundImage(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
        <h5>Background Image</h5>
        <Col s={12}>
        <hr></hr>
        </Col>
        <Textarea id={"bi" + id + face} s={12} onChange={e=>props.updateStyle(cardId, face, id, { backgroundImage: e.target.value })} 
              value={validateStyle(styles.backgroundImage)} label="Image URL"></Textarea>
        <TextInput id={"alt" + id + face}  s={6}  onChange={e=>props.updateStyle(cardId, face, id, { alt: e.target.value })} 
              value={validateStyle(styles.alt)} label={"Alt Text"} value={validateStyle(styles.alt)}/>
        <TextInput id={"bf" + id + face}  s={6} onChange={e=>props.updateStyle(cardId, face, id, { backdropFilter: e.target.value })} 
              value={validateStyle(styles.backdropFilter)} label={"Backdrop Filter"} value={validateStyle(styles.backdropFilter)}/>
        <TextInput id={"bs" + id + face}  s={6} onChange={e=>props.updateStyle(cardId, face, id, { backgroundSize: e.target.value })} 
              value={validateStyle(styles.backgroundSize)} label={"Background Size"} value={validateStyle(styles.backgroundSize)}/>
        <TextInput id={"br" + id + face}  s={6} onChange={e=>props.updateStyle(cardId, face, id, { backgroundRepeat: e.target.value })} 
              value={validateStyle(styles.backgroundRepeat)} label={"Background Repeat"} value={validateStyle(styles.backgroundRepeat)}/>
    </>
  }
  
  export function Colors(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <Col s={12}>
  
    <h5>Colors</h5>
      <Col s={6}>
        <label>Text</label>
        <ColorPicker onColorChange={e=>props.updateStyle(cardId, face, id, { color: e })} color={styles.color || 'rgba(0, 0, 0, 1)'}/>
      </Col>
      <Col s={6}>
      <label>Background</label>
      <ColorPicker onColorChange={e=>props.updateStyle(cardId, face, id, { backgroundColor: e })} color={styles.backgroundColor || 'rgba(0, 0, 0, 1)'}/>
      </Col>
  
     
      </Col>
  }
  
  export function Dimensions(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
    <Col s={12}>
        <h5>Dimensions</h5>
        </Col>
        <Col s={12}>
        <hr></hr>
        </Col>
          <TextInput s={6} id={"Width " + id} label={"Width"}  onChange={e=>props.updateStyle(cardId, face, id, { width: e.target.value })} 
              value={validateStyle(styles.width)}/>
          <TextInput s={6} id={"Height " + id} label={"Height"} onChange={e=>props.updateStyle(cardId, face, id, { height: e.target.value })} 
              value={validateStyle(styles.height)}/>
          <TextInput s={6} id={"MaxW " + id} label={"Max"}  onChange={e=>props.updateStyle(cardId, face, id, { maxWidth: e.target.value })} 
              value={validateStyle(styles.maxWidth)}/>
          <TextInput s={6} id={"MaxH " + id} label={"Max"}  onChange={e=>props.updateStyle(cardId, face, id, { maxHeight: e.target.value })} 
              value={validateStyle(styles.maxHeight)}/>
          <TextInput s={6} id={"MinW " + id} label={"Min"}  onChange={e=>props.updateStyle(cardId, face, id, { minWidth: e.target.value })} 
              value={validateStyle(styles.minWidth)}/>
          <TextInput s={6} id={"MinH " + id} label={"Min"}  onChange={e=>props.updateStyle(cardId, face, id, { minHeight: e.target.value })} 
              value={validateStyle(styles.minHeight)}/>
    </>
  }
  
  export function Positioning(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
   return <>
    <Col s={12}>
        <h5>Positioning</h5>
        <hr></hr>
        </Col>
        <Select onChange={e=>props.updateStyle(cardId, face, id, { position: e.target.value })} 
              value={validateStyle(styles.position)} s={12} label="position">
          <option>relative</option>
          <option>absolute</option>
          <option>sticky</option>
          <option>static</option>
        </Select>
        <TextInput id={"left " + id} onChange={e=>props.updateStyle(cardId, face, id, { left: e.target.value })} 
              value={validateStyle(styles.left)} s={3} label="left"></TextInput>
        <TextInput id={"top " + id} onChange={e=>props.updateStyle(cardId, face, id, { top: e.target.value })} 
              value={validateStyle(styles.top)} s={3} label="top"></TextInput>
        <TextInput id={"right " + id} onChange={e=>props.updateStyle(cardId, face, id, { right: e.target.value })} 
              value={validateStyle(styles.right)} s={3} label="right"></TextInput>
        <TextInput id={"bottom " + id} onChange={e=>props.updateStyle(cardId, face, id, { bottom: e.target.value })} 
              value={validateStyle(styles.bottom)} s={3} label="bottom"></TextInput>
   </>
  }
  
  export function Typography(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
     <Col key={props.id} s={12}>
        <h5>Typography</h5>
        <hr></hr>
        </Col>
        <Row>
          <label>Text</label>
        <Textarea  onChange={e=>props.updateStyle(cardId, face, id, { text: e.target.value })} 
              value={validateStyle(styles.text)} className="bordered" s={12}></Textarea>
        <TextInput id={"fs" + face + id} onChange={e=>props.updateStyle(cardId, face, id, { fontSize: e.target.value })} 
              value={validateStyle(styles.fontSize)} s={4} label="Font Size"></TextInput>
        <TextInput id={"lh" + face + id} onChange={e=>props.updateStyle(cardId, face, id, { lineHeight: e.target.value })} 
              value={validateStyle(styles.lineHeight)} s={4} label="line-height"></TextInput>
        <Select id={"fw" + face + id} onChange={e=>props.updateStyle(cardId, face, id, { fontWeight: e.target.value })} 
              value={validateStyle(styles.fontWeight)} s={4} label="weight">
          <option>100</option>
          <option>200</option>
          <option>300</option>
          <option>400</option>
          <option>500</option>
          <option>600</option>
          <option>700</option>
        </Select>
        </Row>
        <p>Align</p>
        <Col s={12}>
          <Button onClick={e=>props.updateStyle(cardId, face, id, { textAlign: "left" })}  className="btn-primary"><Icon>format_align_left</Icon></Button>
          <Button onClick={e=>props.updateStyle(cardId, face, id, { textAlign: "center" })} className="btn-primary"><Icon>format_align_center</Icon></Button>
          <Button onClick={e=>props.updateStyle(cardId, face, id, { textAlign: "right" })} className="btn-primary"><Icon>format_align_right</Icon></Button>
          </Col>
    </>
  }
  
  export function Padding(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
    <Col s={12}>
        <h5>Padding</h5>
        </Col>
        <TextInput id={"pl" + face + id} s={3} label="left"   onChange={e=>props.updateStyle(cardId, face, id, { paddingLeft: e.target.value })} 
              value={validateStyle(styles.paddingLeft)}></TextInput>
        <TextInput id={"pr" + face + id} s={3} label="top"   onChange={e=>props.updateStyle(cardId, face, id, { paddingTop: e.target.value })} 
              value={validateStyle(styles.paddingTop)}></TextInput>
        <TextInput id={"pt" + face + id} s={3} label="right"   onChange={e=>props.updateStyle(cardId, face, id, { paddingRight: e.target.value })} 
              value={validateStyle(styles.paddingRight)}></TextInput>
        <TextInput id={"pn" + face + id}  s={3} label="bottom"   onChange={e=>props.updateStyle(cardId, face, id, { paddingBottom: e.target.value })} 
              value={validateStyle(styles.paddingBottom)}></TextInput>
   </>
  }
  
  export function Margin(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
    <Col s={12}>
        <h5>Margin</h5>
        </Col>
        <TextInput id={"ml" + face + id} s={3} label="left"   onChange={e=>props.updateStyle(cardId, face, id, { marginLeft: e.target.value })} 
              value={validateStyle(styles.marginLeft)}></TextInput>
        <TextInput id={"mr" + face + id} s={3} label="top"   onChange={e=>props.updateStyle(cardId, face, id, { marginTop: e.target.value })} 
              value={validateStyle(styles.marginTop)}></TextInput>
        <TextInput id={"mt" + face + id} s={3} label="right"   onChange={e=>props.updateStyle(cardId, face, id, { marginRight: e.target.value })} 
              value={validateStyle(styles.marginRight)}></TextInput>
        <TextInput id={"mn" + face + id}  s={3} label="bottom"   onChange={e=>props.updateStyle(cardId, face, id, { marginBottom: e.target.value })} 
              value={validateStyle(styles.marginBottom)}></TextInput>
   </>
  }
  
  export function BoxShadow(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <Col s={12}>
    <h5>Box Shadow</h5>
    <Col s={12}>
      <Button onClick={_=>props.updateStyle(cardId, face, id, { boxShadow: "" })}>Disable</Button>
    </Col>
  <ShadowPicker
            value={validateStyle(styles.boxShadow) || ""}
            onChange={(value) => {
              props.updateStyle(cardId, face, id, { boxShadow: value })
            }}
        />
  </Col>
  }
  
  export function Border(props) {
    let {id, cardId} = props;
    let face = props.front ? "front" : "back"
    let styles = props.source.styles[id].data.styles;
    return <>
    <Col s={12}>
          <h5>Border</h5>
        </Col>
        <Row>
        <Col s={3}>
          <ColorPicker onColorChange={e=>props.updateStyle(cardId, face, id, { borderColor: e })} color={styles.borderColor || 'rgba(0, 0, 0, 1)'}/>
        </Col>
        <TextInput id={"border-width" + face + id} s={3}   
              onChange={e=>props.updateStyle(cardId, face, id, { borderWidth: e.target.value })} 
              value={validateStyle(styles.borderWidth)} label={"Width"}>
        </TextInput>
        <Select id={"fw" + face + id} onChange={e=>props.updateStyle(cardId, face, id, { borderStyle: e.target.value })} 
              value={validateStyle(styles.borderStyle)} s={3} label="Style">
          <option>none</option>
          <option>solid</option>
          <option>dotted</option>
        </Select>
        <TextInput id={"border-radius" + face + id} s={3}  onChange={e=>props.updateStyle(cardId, face, id, { borderRadius: e.target.value })} 
              value={validateStyle(styles.borderRadius)} 
              label={"Radius"}>
        </TextInput>
        </Row>
    </>
  }