import React, { useEffect, useState } from 'react';
import {
    Row, Col, Button, Modal, Collection, CollectionItem, TextInput,
    Textarea, Icon, Collapsible, CollapsibleItem
} from 'react-materialize';
import { connect } from 'react-redux'
import {
    addToSet, flipCard, setTags, updateSet, setName, setDescription, removeCard,
    resetState, setVisibility, setText, updateContainerStyle, setUnsaved
} from '../actions/setActions'
import { getSet, saveSet } from '../api/CardSets';
import CloneModalSet from '../components/CloneModalSet'
import { addCard } from '../api/CardsAPI';
import LoaderCircle from '../components/LoaderCircle';
import CommentBox from '../components/comments/CommentBox';
import { TagDisplay, TagSelector } from '../components/Tags';
import { addMessage } from '../actions/toastActions';
import { addCard as newCard } from '../actions/cardActions';
import SetOutput from './SetOutput';
import { generateRegularCard } from '../Code/CodeGenerator';
import { CONTAINER_OPTIONS } from '../utils/Constants';
import StyleModal from '../components/StyleModal';
import { useHistory } from 'react-router';
import InfoModal from '../components/InfoModal';
import WarningModal from '../components/WarningModal';
import EditorLayout from '../Layout/EditorLayout';
import InsertCard from './InsertCard';
import AddCollaborators from '../components/AddCollaboratorsSet'
function validateStyle(styleValue) {
    if (styleValue === undefined)
        return "";
    else if (!isNaN(styleValue)) { // error if they forget "px" after number
        return `${styleValue}` // stringify style (number)
    }
    else return styleValue;
}

const Iframe = (props) => {
    const writeHTML = (frame) => {
        if (!frame) {
            return;
        }
        let doc = frame.contentDocument;
        doc.open();
        doc.write(props.content);
        doc.close();
    };
    return (
        <iframe title="html" frameBorder="0" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} />
    );
};

function Preview(props) {
    if (!props.open)
        return null;
    let card = generateRegularCard({ ...props.sets, gridEnabled: false })
    return <Iframe content={card.html + "<style>" + card.css.container + card.css.wrapper + card.css.body + card.css.extras + card.css.content + card.css.content.css + "</style><script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script><script>" + card.js + "</script>"} />
}
function EditSet(props) {
    const [codeOpen, setCodeOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    let history = useHistory();
    let id = new URLSearchParams(props.location.search).get("id")
    const loadCardSets = () => {
        getSet(id)
            .then(res => {
                props.updateSet(res.data.allCards[0]);
            })
            .catch(_ => {
                history.push("/dashboard")
                props.addMessage({ message: "Set has been deleted or does not exist!", type: 2 })
            })
    }
    useEffect(_ => {
        loadCardSets()
        return () => {
            props.resetState();
        };
    }, [])
    if (!props.sets.cards)
        return <LoaderCircle />
    let { name } = props.sets;
    let isOwner = props.sets.createdBy === props.auth.user.id;
    let isContributor = props.sets.contributors.includes(props.auth.user.username)
    const newCardWithTemplate = (card) => {
        let newCard = card;
        newCard.createdBy = props.auth.user.id;
        addCard(props.auth.user.id, newCard)
            .then(res => {
                props.addMessage({ message: "Card Saved to Library!", type: 1 })
                props.newCard(res.data.updated);
            })
            .catch(_ => {
                props.addMessage({ message: "Error Saving Card!", type: 2 })
            })
    }
    function renderCardSelectors() {
        if (!props.sets.cards || !props.sets.cards.length) {
            return <div>
                <h5>No Cards Yet</h5>
                <p>Click the button below to begin.</p>
            </div>
        } else return props.sets.cards.map((card, index) => {
            return <CollectionItem key={index} className="card-item">
                <p className="left truncate">{card.name}</p>
                <i className="material-icons right" onClick={_ => props.removeCard(index)}>delete</i>
                {<i onClick={_ => newCardWithTemplate(card)} className="material-icons right">save</i>}
                {card.backEnabled && <i className="material-icons right" onClick={_ => props.flipCard(index, !card.flipped)}>
                    {card.flipped ? "flip_to_front" : "flip_to_back"}
                </i>}
            </CollectionItem>
        })
    }
    function renderToolbar() {
        if(isOwner ||isContributor){
            return <React.Fragment>
            <div>
                <nav className="bg-primary">
                    <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
                        <h5 className="truncate" style={{ lineHeight: "32px" }}>{name}</h5>
                    </div>
                </nav>
                <div className='console'>
                    <div className='console-content'>
                        <h5 className="black-text">
                            Container
                            <InfoModal title="Container" trigger={
                                <span className="material-icons right card-toolbar-help">
                                    help
                                </span>
                            }>
                                <p>A container is an element wrapper around your cards. The most common use is to give your card sets a background and padding around all of the cards. </p>
                            </InfoModal>
                        </h5>
                        <Collapsible accordion>
                            <CollapsibleItem header={<b style={{ textAlign: "center", width: "60%" }}>Container</b>}
                                icon={<i className="material-icons">dashboard</i>} >
                                <div className='componentEditor'>
                                    <Row>
                                        <StyleModal trigger={
                                            <Col style={{ marginBottom: 15 }} s={12}><div style={{ textDecoration: "underline",color:"blue", cursor:"pointer" }}>What do these mean?</div></Col>
                                        } />
                                        {CONTAINER_OPTIONS.map((value, index) => {
                                            let styleValue = validateStyle(props.sets.container[value[1]]);
                                            return <TextInput key={index} id={"container-" + index} value={styleValue} s={6} label={value[0]}
                                                onChange={e => props.updateContainerStyle(value[1], e.target.value)}
                                            />
                                        })}
                                    </Row>
                                </div>
                            </CollapsibleItem>
                        </Collapsible>
                        <h5 className="black-text">
                            Cards
                            <InfoModal title="Cards" trigger={
                                <span className="material-icons right card-toolbar-help">
                                    help
                                </span>
                            }>
                                <p>The card selector allows you to add your pre-made cards to the set. Text is available to change by clicking on it. </p>
                            </InfoModal>
                        </h5>
                        <Collection className="card-collection">
                            {renderCardSelectors()}
                        </Collection>
                        <InsertCard {...props} trigger={
                            <Button icon={<Icon className="right">add</Icon>} className="btn btn-primary full-width">Insert Card</Button>
                        } />
                    </div>
                </div>
            </div></React.Fragment> 
        }else{
            return <React.Fragment>
            <div>
                <nav className="bg-primary">
                    <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
                        <h5 className="truncate" style={{ lineHeight: "32px" }}>{name}</h5>
                    </div>
                </nav>
                <h6 style={{ fontWeight:"1000", padding:"30px", color:"red", textAlign:"center" }}>Clone this set to edit it and make it your own!</h6>
                <div className='console' style={{marginBottom:0, height:0, overflow:"hidden"}}>
                    <div className='console-content' style={{marginBottom:0, height:0, overflow:"hidden"}}>
                        <CloneModalSet usersID={props.auth.user.id} cardEditor={props.editor} trigger={
                        <Button icon={<Icon className="right">content_copy</Icon>} className="btn btn-primary full-width" type="submit" tooltip="Clone this set!">
                            <span className="hide-on-small-only">Clone this set!</span>
                        </Button>                              
                        } />
                    </div>
                </div>
                <div id="uneditableContainer" style={{pointerEvents:"none"}}>
                    <div className='console'>
                        <div className='console-content'>
                            <h5 className="black-text">
                                Container
                                <InfoModal title="Container" trigger={
                                    <span className="material-icons right card-toolbar-help">
                                        help
                                    </span>
                                }>
                                    <p>A container is an element wrapper around your cards. The most common use is to give your card sets a background and padding around all of the cards. </p>
                                </InfoModal>
                            </h5>
                            <Collapsible accordion>
                                <CollapsibleItem header={<b style={{ textAlign: "center", width: "60%" }}>Container</b>}
                                    icon={<i className="material-icons">dashboard</i>} >
                                    <div className='componentEditor'>
                                        <Row>
                                            <StyleModal trigger={
                                                <Col style={{ marginBottom: 15 }} s={12}><div style={{ textDecoration: "underline",color:"blue", cursor:"pointer" }}>What do these mean?</div></Col>
                                            } />
                                            {CONTAINER_OPTIONS.map((value, index) => {
                                                let styleValue = validateStyle(props.sets.container[value[1]]);
                                                return <TextInput key={index} id={"container-" + index} value={styleValue} s={6} label={value[0]}
                                                    onChange={e => props.updateContainerStyle(value[1], e.target.value)}
                                                />
                                            })}
                                        </Row>
                                    </div>
                                </CollapsibleItem>
                            </Collapsible>
                            <h5 className="black-text">
                                Cards
                                <InfoModal title="Cards" trigger={
                                    <span className="material-icons right card-toolbar-help">
                                        help
                                    </span>
                                }>
                                    <p>The card selector allows you to add your pre-made cards to the set. Text is available to change by clicking on it. </p>
                                </InfoModal>
                            </h5>
                            <Collection className="card-collection">
                                {renderCardSelectors()}
                            </Collection>
                            <InsertCard {...props} trigger={
                                <Button icon={<Icon className="right">add</Icon>} className="btn btn-primary full-width">Insert Card</Button>
                            } />
                        </div>
                    </div>
                </div>
            </div></React.Fragment>            
        }
    }
    const handleSave = (context, offset) => {
        if(offset === 1){
            if(context === "private")props.setVisibility("public")
            else props.setVisibility("private")
            saveSet(id, props.sets)
        }else{
            props.setUnsaved();
            saveSet(id, props.sets)
                .then(_ => props.addMessage({ message: "Set Saved Successfully!", type: 1 }))
                .catch(_ => props.addMessage({ message: "Error Saving Cards!", type: 2 }))
        }
    }
    function renderToptoolbar() {
        return <div>
            <Button
                icon={<Icon className="right">code</Icon>}
                onClick={_ => setCodeOpen(true)}
                style={{ lineHeight: "12px" }}
                className="btn btn-outline" >
                Export Card
            </Button>
            <Button
                icon={<Icon className="right">visibility</Icon>}
                onClick={_ => setPreviewOpen(true)}
                className="btn btn-primary" >
                Preview
            </Button>
            <Modal
                header='Preview'
                height='100%'
                width='100%'
                className="preview"
                options={{
                    onCloseEnd: _ => setPreviewOpen(false),
                }}
                open={previewOpen}>
                <div style={{ height: '100%', paddingBottom: 20 }}>
                    <Preview open={previewOpen} {...props} />
                </div>
            </Modal>
            {!isOwner && !isContributor &&
                <CloneModalSet usersID={props.auth.user.id} cardEditor={props.sets} action_name="Save Set" title="Clone set"  trigger={
                    <Button icon={<Icon className="right">content_copy</Icon>} className="btn btn-primary" type="submit" tooltip="Clone this set!">
                        <span className="hide-on-small-only">Clone this set!</span>
                    </Button>                              
                } />
            }
            {(isOwner||isContributor) && <React.Fragment><Button className="btn btn-primary"
                onClick={e => handleSave(e)}
                icon={<Icon className="right">save</Icon>}
                type="submit" tooltip="Save current card changes">
                Save
                </Button>
                <Modal
                    fixedFooter={true}
                    header='Export Card'
                    options={{
                        onCloseEnd: _ => setCodeOpen(false),
                    }}
                    open={codeOpen}>
                    <SetOutput open={codeOpen} sets={props.sets} />
                </Modal>
                <WarningModal warningText="As you are saving the set as a different visibility, this will save your set. Are you sure you want to save?" action_name="Save" title="Save card" continueAction={_ => handleSave(props.sets.visibility,1)} trigger={
                <Button
                    icon={<Icon className="right">public</Icon>}
                    onClick={_ => handleSave(props.sets.visibility, 1)}
                    className="btn btn-primary" >
                    Make Set {props.sets.visibility === "public"? "private" : "public" }
                </Button>
                }/>
                <Modal
                    header='Settings'
                    trigger={<Button icon={<Icon className="right">settings</Icon>} className="btn btn-primary" >Settings</Button>}>
                    <h5>Card Name</h5>
                    <TextInput id="set-name-3" className="bordered" onChange={e => props.setName(e.target.value)} value={props.sets.name} placeholder="Set Name" />
                    <h5>Card Description</h5>
                    <Textarea className="bordered"
                        placeholder="Set Description"
                        onChange={e => props.setDescription(e.target.value)}
                        value={props.sets.description}
                    />
                    <TagSelector tags={props.sets.tags} setTags={props.setTags} />
                    <TagDisplay tags={props.sets.tags} setTags={props.setTags} deleteable={true} />
                    <Button modal="close" style={{width: '100%', marginTop:60}} icon={<Icon className="right">save</Icon>} onClick={e => handleSave(e)}  className="btn btn-primary" >
                        <span className="hide-on-small-only" tooltip="Save your settings!">Save Settings</span>
                    </Button>
                </Modal></React.Fragment>}
                <Modal header='Card Comments'
                trigger={<Button  tooltip="Comment on this set!" icon={<Icon className="right">comments</Icon>} className="btn btn-primary">Comments</Button>}>
                <CommentBox cardEditor={props.sets} usersID={props.auth.user.id} userInfo={props.auth.user.name}
                    url={`/comments/card/'${id}/${name}/${props.auth.user.id}`}
                    pollInterval={2000} />
                </Modal>
                {isOwner &&
                    <AddCollaborators username={props.auth.user.username} cardEditor={props.sets} trigger={
                        <Button icon={<Icon className="right">people</Icon>} className="btn btn-primary" type="submit" tooltip="Add Collaborators to this set!">
                            <span className="hide-on-small-only">Add/Remove Collaborators!</span>
                        </Button>                              
                    } />
                }
        </div>
    }
    function renderCards() {
        if (!props.sets.cards)
            return null;
        let renderBody = (cardId, card, source) => card[source].styles.map((style, index) => {
            const { name, styles } = style.data;
            let advancedStyles = style.data.advancedStyles;
            if(advancedStyles)
            for (let [k, v] of Object.entries(advancedStyles)) {
                let x = k.replace(/-([a-z])/g, function (m, w) {
                    return w.toUpperCase();
                });
                delete advancedStyles[k];
                advancedStyles[x] = v;
            }
            switch (name) {
                case "Image":
                    return <div key={index} style={{...styles, ...advancedStyles}} />
                case "Title":
                    return <h1 suppressContentEditableWarning={true}
                        onBlur={e => props.setText(cardId, index, e.currentTarget.textContent)}
                        contentEditable
                        key={index}
                        style={{ ...styles, ...advancedStyles, cursor: "text" }}>
                        {styles.text}
                    </h1>
                case "Button":
                    return <button key={index} style={{...styles, ...advancedStyles}}>{styles.text}</button>
                case "Paragraph":
                    return <p suppressContentEditableWarning={true}
                        onBlur={e => props.setText(cardId, index, e.currentTarget.textContent)}
                        contentEditable
                        key={index}
                        style={{ ...styles, ...advancedStyles, cursor: "text" }}>
                        {styles.text}
                    </p>
                default:
                    return null
            }
        })
        return <React.Fragment>
            <div className="set-body" style={{ ...props.sets.container }}>
                {props.sets.cards.map((card, index) => {
                    return <div style={{ display: "inline-block", margin: 10 }} key={index}>
                        <div className="card-body" style={card.body} >
                            {renderBody(index, card, card.flipped ? "back" : "front")}
                        </div>
                    </div>
                })}
            </div>
        </React.Fragment>
    }
    return <React.Fragment>
        <EditorLayout
            scrollHidden={false}
            top_toolbar={renderToptoolbar()}
            toolbar={renderToolbar()}>
            {renderCards()}
        </EditorLayout>
    </React.Fragment>
}
const mapStateToProps = state => ({
    auth: state.auth,
    sets: state.sets,
});

export default connect(
    mapStateToProps,
    {
        addToSet, newCard, setTags, flipCard, updateSet, setName,
        setDescription, addMessage, resetState, updateContainerStyle,
        setVisibility, setText, removeCard, setUnsaved
    }
)(EditSet);