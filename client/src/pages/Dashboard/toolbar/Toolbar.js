
import React, { useState } from 'react';
import '../Dashboard.css';
import 'materialize-css';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../../actions/authActions";
import { addMessage } from "../../../actions/toastActions";
import AddContent from "../../../components/AddContent"
import {
  Row,
  Collapsible,
  CollapsibleItem,
  Button,
  Switch,
  Modal,
  Col,
  Select as Select2,
  TextInput,
  CollectionItem,
  Collection,
  Icon,
  Tabs,
  Tab,
} from 'react-materialize';
import {
  updateStyle,
  addContent,
  removeContent,
  swapContent,
  setEditingStyle,
  deleteAdvanced,
  updateFixedContent,
  toggleOption,
  setFlipTrigger,
  setGridEnabled,
  updateBody,
  setCardVisibility,
  updateCardTitle,
  addCardToSet,
  gridOption,
  updateContainer,
  swapCard,
  cloneCard,
  deleteCard,
  updateAdvancedStyle,
  setFlipDirection
} from "../../../actions/editorActions";
import InfoModal from '../../../components/InfoModal';
import StyleModal from '../../../components/StyleModal';



const otherOptions = [
  ['Text', 'text'],
  ['Color', 'color'],
  ['Text Align', 'textAlign'],
  ['Height', 'height'],
  ['Width', 'width'],
  ['Font Family', 'fontFamily'],
  ['Font Weight', 'fontWeight'],
  ['Display', 'display'],
  ['Background Color', 'backgroundColor'],
  ['Box Shadow', 'boxShadow'],
  ['Margin', 'margin'],
  ['Padding', 'padding'],
  ['Border', 'border'],
  ['Border Radius', 'borderRadius'],
  ['Font Size', 'fontSize'],
  ['Line Height', 'lineHeight'],
]
const bodyOptions = [
  ['Width', 'width'],
  ['Height', 'height'],
  ['Max Height', 'maxHeight'],
  ['Max Width', 'maxWidth'],
  ['Text Align', 'textAlign'],
  ['Font Family', 'fontFamily'],
  ['Border', 'border'],
  ['Background Color', 'backgroundColor'],
  ['Box Shadow', 'boxShadow'],
  ['Margin', 'margin'],
  ['Border Radius', 'borderRadius'],
  ['Padding', 'padding'],
  ['Display', 'display'],
  ['Position', 'position'],
  ['Background Image', 'backgroundImage'],
  ['Background Size', 'backgroundSize'],
  ['Background Repeat', 'backgroundRepeat'],
  ['Backdrop Filter', 'backdropFilter'],
  ['Background', 'background']
]



const imageOptions = [
  ['Background', 'backgroundImage'],
  ['Alt', 'alt'],
  ['Height', 'height'],
  ['Width', 'width'],
  ['Display', 'display'],
  ['Min Height', 'minHeight'],
  ['Background Size', 'backgroundSize'],
  ['Box Shadow', 'boxShadow'],
  ['Margin', 'margin'],
  ['Border Radius', 'borderRadius'],
  ['Padding', 'padding'],
]


function LookUpComponent(props) {
  switch (props.name) {
    case "Image":
      return <ContentOption icon="image" optionSet={imageOptions} {...props} />
    case "Title":
      return <ContentOption icon="title" optionSet={otherOptions} {...props} />
    case "Paragraph":
      return <ContentOption icon="short_text" optionSet={otherOptions} {...props} />
    case "Button":
      return <ContentOption icon="smart_button" optionSet={otherOptions} {...props} />
      case "Link Button":
        console.log([['href', 'href']].concat(otherOptions))
      return <ContentOption icon="link" optionSet={[['href', 'href']].concat(otherOptions)} {...props} />
    case "Seperator":
      return <ContentOption icon="maximize" optionSet={otherOptions} {...props} />
    default:
      return <ContentOption optionSet={otherOptions}  {...props} />
  }
}

function LookUpStyle(props) {
  switch (props.name) {
    case "Image":
      return <StyleEditor source={props.source} icon="image" optionSet={imageOptions} {...props} />
    case "Title":
      return <StyleEditor source={props.source} icon="title" optionSet={otherOptions} {...props} />
    case "Paragraph":
      return <StyleEditor source={props.source} icon="short_text" optionSet={otherOptions} {...props} />
    case "Button":
      return <StyleEditor source={props.source} icon="smart_button" optionSet={otherOptions} {...props} />
      case "Link Button":
        return <StyleEditor source={props.source} icon="smart_button" optionSet={[['href', 'href']].concat(otherOptions)} {...props} />
    case "Seperator":
      return <StyleEditor source={props.source} icon="maximize" optionSet={otherOptions} {...props} />
    default:
      return <StyleEditor source={props.source} optionSet={otherOptions}  {...props} />
  }
}

function GridModal(props) {
  return <Modal
    trigger={
      props.trigger
    }>
    <div style={{ padding: 20 }}>
      <h5>Advanced Options</h5>
      <p>Avanced options allow you to put CSS properties that are not listed by default. To add one, enter your style name and value in the corrosponding boxes and click 'Add Style'.</p>
      <p><b>Style Name: </b> Name of your CSS property, eg. border-radius, margin-left.</p>
      <p><b>Style Value: </b> Value of your CSS property, eg. 'left', '10px'.</p>
      <a target="new" href="https://www.w3schools.com/cssref/">See More</a>
    </div>
  </Modal>
}

function AdvancedStyles(props) {
  const [advancedStyles, setAdvancedStyles] = useState([]);
  const [styleName, setStyleName] = useState("");
  const [styleValue, setStyleValue] = useState("");
  let { face, id } = props;
  const addAdvanced = (name, value) => {
    if (styleName.length && styleValue.length && /^[a-zA-Z-]+$/.test(styleName)) {
      let newStyles = advancedStyles;
      newStyles.push({ name, value });
      setAdvancedStyles(newStyles);
      props.updateAdvancedStyle(props.cardId, props.face, props.id, { [styleName]: styleValue })
    }
    setStyleName("");
    setStyleValue("");
  }
  function camelCaseToDash (str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
  }
  let advancedArray = [];
  if (props.editor[face].styles[id].data.advancedStyles)
    advancedArray = Object.entries(props.editor[face].styles[id].data.advancedStyles);
  return <React.Fragment><h5>Advanced styles</h5>
    <GridModal trigger={
      <Col style={{ marginBottom: 15 }} s={12}><a style={{ textDecoration: "underline" }}> How do I use this?</a></Col>
    } />
    <Row>
      <TextInput id={props.id + "styleName"} value={styleName} onChange={e => setStyleName(e.target.value)} s={6} label={"Style Name"} />
      <TextInput id={props.id + "styleValue"} value={styleValue} onChange={e => setStyleValue(e.target.value)} s={6} label={"Style Value"} />
      <Button icon={<Icon className="right">add</Icon>} onClick={_ => addAdvanced(styleName, styleValue)} className="btn btn-primary">Add Style</Button>
    </Row>
    <Row>
      {advancedArray && advancedArray.map((style, index) => {
        return <React.Fragment>
          <TextInput className="advanced-input" id={props.id + style[0]} disabled value={camelCaseToDash(style[0])} s={6} />
          <TextInput onChange={e => props.updateAdvancedStyle(props.cardId, props.face, props.id, { [style[0]]: e.target.value })} className="advanced-input" id={props.id + style[0]} value={style[1]} s={6} />
          <Col s={12}><span onClick={_ => props.deleteAdvanced(0, face, id, style[0])} className="meterial-icons right red-text text-lighten-1">delete</span></Col>
        </React.Fragment>
      })}
    </Row></React.Fragment>
}

function ContentOption(props) {
  const { id, name, cardId, front, swapContent, removeContent } = props;
  let face = front ? "front" : "back"
  const styleActionButtons = [
    {
      icon: 'keyboard_arrow_down',
      tooltip: 'Move Down',
      action: _ => swapContent(cardId, face, id, id + 1)
    },
    {
      icon: 'keyboard_arrow_up',
      tooltip: 'Move Up',
      action: _ => swapContent(cardId, face, id, id - 1)
    },
    {
      icon: 'delete',
      tooltip: 'Delete Card',
      action: _ => removeContent(props.cardId, face, id)
    },
  ]
  return <CollectionItem className="style-button" key={id} onClick={_ => props.setEditingStyle({ id, face })}>
    <div style={{ display: "flex", width: "100%", alignItems: "center" }}><span style={{ width: '100%', fontWeight: 'bold' }}>
      <i className="material-icons left">{props.icon}</i>
      {name}</span>
      <ActionButtons actionButtons={styleActionButtons} />
    </div>
  </CollectionItem>
}


function StyleEditor(props) {
  const { updateStyle, id, optionSet, cardId, front } = props;
  let face = front ? "front" : "back"
  return <div>
    <h5>Styles</h5>

    <StyleModal trigger={
      <Col style={{ marginBottom: 15 }} s={12}><a style={{ textDecoration: "underline" }}>What do these mean?</a></Col>
    } />
    <Row>
      {optionSet.map((value, index) => {
        let styleName = value[1];
        if (!props.editor[face].styles[id])
          return null
        let styleValue = validateStyle(props.editor[face].styles[id].data.styles[styleName])
        return <TextInput key={index} id={face + "content" + index + id} s={6} label={value[0]} value={styleValue}
          onChange={e => {
            updateStyle(cardId, face, id, { [styleName]: e.target.value })
          }} />
      })}
    </Row>
    <AdvancedStyles {...props} face={face} cardId={cardId} id={id} />
  </div>
}


function StyleSelector(props) {
  const { createdBy, front, back, body, backEnabled } = props.editor;
  const { id } = props.auth.user;
  return <React.Fragment>
    <ToolBarNav {...props} />
    <div className='console'>
      <div className='console-content'>

        <h5 className="black-text">
          Card Body
          <InfoModal title="Card Body" trigger={
            <span className="material-icons right card-toolbar-help">
              help
            </span>
          }>
            <p>The card body is a container for elements. It contains all content on the front and back of your card. It is required by default, but not having any styles active is possible.</p>
            <p>To edit to style of your card body, click on "body" and options will appear.</p>
          </InfoModal>
        </h5>

        <Collapsible accordion>
          <CollapsibleItem header={<b style={{ textAlign: "center", width: "60%" }}>Body</b>}
            icon={<i className="material-icons">dashboard</i>} >
            <div className='componentEditor'>

              <Row>
                <StyleModal trigger={
                  <Col style={{ marginBottom: 15 }} s={12}><a style={{ textDecoration: "underline" }}>What do these mean?</a></Col>
                } />
                {bodyOptions.map((value, index) => {
                  let styleValue = validateStyle(body[value[1]]);
                  return <TextInput key={index} id={props.cardId + "body" + index} s={6} label={value[0]} value={styleValue}
                    onChange={e => {
                      props.updateBody(props.cardId, { [value[1]]: e.target.value });
                    }} />
                })}
              </Row>
            </div>
          </CollapsibleItem>
        </Collapsible>
        <h5 className="black-text">
          Card Front
          <InfoModal title="Card Front" trigger={
            <span className="material-icons right card-toolbar-help">
              help
            </span>
          }>
            <p>The front of your card consists of elements visible initially. A real world example of this would be the front of a credit card (side with card number)</p>
            <p>To add content to the front of your card, and click "Add Element" below.</p>
          </InfoModal>
        </h5>
        <Collection className="raise-element square">
          {front.styles.map((option, index) => {
            return <React.Fragment key={index}>
              <LookUpComponent {...props} front={true} name={option.data.name} id={index} />
            </React.Fragment>
          })}
        </Collection>
        <AddContent trigger={
          <Button className="btn right hoverable btn-primary full-width" style={{ marginBottom: 20 }}>
            Add Element<i className="material-icons right">add</i>
          </Button>
        } front={true} {...props} />
        <h5 className="black-text ">
          Card Back
          <InfoModal title="Card Back" trigger={
            <span className="material-icons right card-toolbar-help">
              help
            </span>
          }>
            <p>The back of your card consists of elements visible once the card is flipped. A real world example of this would be the back of a credit card (side with security code)</p>
            <p>To add content to the back of your card, make sure the switch is flipped to "on" and click "Add Element"</p>
          </InfoModal>
        </h5>
        <div style={{ marginBottom: 20 }}>
          <Switch
            id="Switch-11"
            offLabel="Off"
            checked={backEnabled}
            onChange={_ => { props.toggleOption(props.cardId, "backEnabled") }}
            onLabel="On"
          />
        </div>
        {backEnabled && <React.Fragment>
          <Collection className="raise-element square">
            {back.styles.map((option, index) => {
              return <React.Fragment key={index}>
                <LookUpComponent {...props} front={false} name={option.data.name} id={index} />
              </React.Fragment>
            })}
          </Collection>
          <AddContent trigger={
            <Button className="btn right hoverable btn-primary full-width" style={{ marginBottom: 20 }}>
              Add Element<i className="material-icons right">add</i>
            </Button>
          } front={false} {...props} />
          <h5 className="black-text ">
            Triggers
            <InfoModal title="Triggers" trigger={
              <span className="material-icons right card-toolbar-help">
                help
              </span>}>
              <p>Triggers determine what element will cause the card to flip faces. For example if you pick "body" as a trigger the card will flip on a click of the Card Body.</p>
              <p><b>Front Transition Trigger:</b> What element on the front causes the card to flip</p>
              <p><b>Back Transition Trigger:</b> What element on the back causes the card to flip</p>
            </InfoModal>
          </h5>
          <div className="full-width">
            <Select2
              id="Select-9"
              label="Front transition trigger"
              className="full-width"
              multiple={false}
              onChange={e => { props.setFlipTrigger(props.cardId, true, e.target.value) }}
              icon={false}
              value="2">
              <option value={0}>Body</option>
              {front.styles.map((style, index) => {
                return <option key={index} value={index}>{style.data.name}</option>
              })}
            </Select2>
          </div>
          <div className="full-width">
            <Select2
              id="Select-9"
              label="Back transition trigger"
              multiple={false}
              icon={false}
              onChange={e => { props.setFlipTrigger(props.cardId, false, e.target.value) }}
              value="2">
              <option value={0}>Body</option>
              {back.styles.map((style, index) => {
                return <option key={index} value={index}>{style.data.name}</option>
              })}
            </Select2>
          <h5 className="black-text ">
            Flip Direction
            </h5>
          <div style={{ marginBottom: 20 }}>
          <Select2
              id="Select-10"
              label="Flip Direction"
              multiple={false}
              icon={false}
              onChange={e => {  props.setFlipDirection(e.target.value) }}
              value={props.editor.flipDirection}>
              <option value={true}>Vertical</option>
              <option value={false}>Horizontal</option>
            </Select2>
            </div>
        </div>
        </React.Fragment>}
      </div>
    </div>
  </React.Fragment>
}
function ActionButtons(props) {
  const stopPropAction = (e, fun) => {
    e.stopPropagation();
    fun();
  }
  return props.actionButtons.map((value, id) => {
    return <Button key={id} onClick={e => stopPropAction(e, _ => value.action(props.index))} tooltip={value.tooltip} className="btn-flat right"
      style={{ width: 30, padding: 0, fontSize: 24 }} icon={<i style={{ fontSize: 24 }} className="material-icons">{value.icon}</i>}>
    </Button>
  })
}

function ToolBarNav(props) {
  let cardName = props.editor.name;
  return <nav className="bg-primary">
    <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
      <h5 className="truncate" style={{  lineHeight: "32px" }}>{cardName}</h5>
    </div>
  </nav>
}

function validateStyle(styleValue) {
  if (styleValue === undefined)
    return "";
  else if (!isNaN(styleValue)) { // error if they forget "px" after number
    return `${styleValue}` // stringify style (number)
  }
  else return styleValue;
}
function Toolbar(props) {
  if (props.editor.editingStyleIndex.id !== -1) {
    let styleValue = props.editor[props.editor.editingStyleIndex.face].styles[props.editor.editingStyleIndex.id].data;
    return <div className="tool-bar-wrapper">
      <nav className="bg-primary">
        <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
          <i onClick={_ => props.setEditingStyle({ id: -1, face: "front" })} style={{ marginRight: 10 }} className="material-icons">west</i>
          <h5 className="truncate" style={{ lineHeight: "32px" }}>{styleValue.name}</h5>
        </div>
      </nav>

          <div className='console'>
          <div className='console-content'>
            <LookUpStyle source={props.editor[props.editor.editingStyleIndex.face]} {...props} name={styleValue.name} id={props.editor.editingStyleIndex.id} front={props.editor.editingStyleIndex.face === "front"} />
          </div>
        </div>

     
    </div>
  }
  return <div className="tool-bar-wrapper">
    <StyleSelector {...props} />
  </div>
}

Toolbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateStyle: PropTypes.func.isRequired,
  addContent: PropTypes.func.isRequired,
  removeContent: PropTypes.func.isRequired,
  swapContent: PropTypes.func.isRequired,
  updateFixedContent: PropTypes.func.isRequired,
  toggleOption: PropTypes.func.isRequired,
  setFlipTrigger: PropTypes.func.isRequired,
  setCardVisibility: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: { ...state.styles },
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {
    logoutUser,
    updateStyle,
    addContent,
    updateCardTitle,
    deleteAdvanced,
    removeContent,
    swapContent,
    addMessage,
    updateFixedContent,
    toggleOption,
    setFlipDirection,
    updateBody,
    setFlipTrigger,
    setEditingStyle,
    addCardToSet,
    updateAdvancedStyle,
    cloneCard,
  }
)(Toolbar);