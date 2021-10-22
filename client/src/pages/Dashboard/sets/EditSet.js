import React, { useEffect, useState } from 'react';
import {
     Row, Col, Button, Modal, Collection, CollectionItem, TextInput,
     Textarea, Icon, Collapsible, CollapsibleItem, Pagination 
} from 'react-materialize';
import { connect } from 'react-redux'
import { 
    addToSet, flipCard, setTags, updateSet, setName, setDescription, removeCard,
     resetState, setVisibility, setText, updateContainerStyle, setUnsaved 
} from '../../../actions/setActions'
import { copySet, getSet, saveSet } from '../../../api/CardSets';
import { addCard, loadCards } from '../../../api/CardsAPI';
import LoaderCircle from '../../../components/LoaderCircle';
import CommentBox from '../../../components/comments/CommentBox';
import { TagDisplay, TagSelector } from '../../../components/Tags';
import { addMessage } from '../../../actions/toastActions';
import { addCard as newCard } from '../../../actions/cardActions';
import SetOutput from '../output/SetOutput';
import { generateRegularCard } from '../output/CodeGenerator';
import { MOST_RECENT } from '../../../utils/Constants';
import { FilterDropDown, getSort } from '../../../components/Sort';
import StyleModal from '../../../components/StyleModal';
import { Prompt, useHistory } from 'react-router';
import InfoModal from '../../../components/InfoModal';

const containerOptions = [
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
    ['Background Image', 'backgroundImage'],
    ['Background Size', 'backgroundSize'],
    ['Background Repeat', 'backgroundRepeat'],
    ['Backdrop Filter', 'backdropFilter'],
]

function EditorLayout(props) {
    const colStyling = {
        style: {
            padding: 0
        },
        className: 'paneGradient'
    }
    return <React.Fragment><Col {...colStyling} s={9}>
        <div className="top-toolbar">
            {props.top_toolbar}
        </div>
        <div className='card-render'>
            {props.children}
        </div>
    </Col>
        <Col {...colStyling} s={3}>
            <div className="tool-bar-wrapper">
                {props.toolbar}
            </div>
        </Col></React.Fragment>
}
function InsertCard(props) {
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [nameFilter, setNameFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState(MOST_RECENT)
    const { user } = props.auth;
    if (!loaded) {
        loadCards(user.id)
            .then(res => {
                let data = res.data.allCards;
                setData(data)
                setLoaded(true);
            })
            .catch(_ => {
                props.addMessage({ message: "Error loading cards", type: 1 })
            })
        return null;
    }
    let addToSet = (card) => {
        props.addToSet(card);
    }
    let pageStart = (currentPage - 1) * 30;
    let defaultCards = data.filter(cards => cards.createdBy === user.id);
    return <Modal
        header='Card Library'
        fixedFooter={true}
        trigger={
            props.trigger
        }>
        <div style={{ padding: 20 }}>
            <b>Search:</b>
            <input value={nameFilter} 
                onChange={e => setNameFilter(e.target.value)} 
                className="bordered" 
                placeholder="Card Name" 
                type="text" id="TextInput-E3" />
            <FilterDropDown sort={sort} setSort={setSort} />
            <div className="card-grid-container-wide">
                {defaultCards.filter(v => {return v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase())})
                    .sort((a, b) => getSort(a, b, sort))
                    .slice(pageStart, pageStart + 30)
                    .map((value, index) => {
                        return <div onClick={_ => addToSet(value)} className="card-grid-item" key={index}>
                            <h5 className="text-left"><b>{value.name}</b></h5>
                            <p>{value.description}</p>

                        </div>
                })}

            </div>
            <Pagination
                activePage={currentPage}
                onSelect={page => setCurrentPage(page)}
                items={(defaultCards.length / 30) + 1}
                leftBtn={<Icon>chevron_left</Icon>}
                maxButtons={8}
                rightBtn={<Icon>chevron_right</Icon>}
            />
        </div>
    </Modal>
}
function validateStyle(styleValue) {
    if (styleValue === undefined)
        return "";
    else if (!isNaN(styleValue)) { // error if they forget "px" after number
        return `${styleValue}` // stringify style (number)
    }
    else return styleValue;
}

const Iframe = (props) => {
    let iframe_ref = null;
    const writeHTML = (frame) => {
        if (!frame) {
            return;
        }
        iframe_ref = frame;
        let doc = frame.contentDocument;
        doc.open();
        doc.write(props.content);
        doc.close();
    };
    return (
        <iframe frameBorder="0" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} />
    );
};

function Preview(props) {
    if (!props.open)
        return null;
    let card = generateRegularCard({ ...props.sets, gridEnabled: false })
    return <Iframe content={card.html + "<style>" + card.css.container + card.css.wrapper + card.css.body + card.css.extras + card.css.content + card.css.content.css + "</style><script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script>" + "<script>" + card.js + "</script>"} />
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
            .catch(_=> {
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
        return <React.Fragment><nav className="bg-primary">
            <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
                <h5 className="truncate" style={{  lineHeight: "32px" }}>{name}</h5>
            </div>
        </nav><div className='console'>
                <div className='console-content'>
                    <h5 className="black-text">
                    Container
                <InfoModal title="Container" trigger={
                        <span className="material-icons right card-toolbar-help">
                        help
                        </span>
                    }>
                        <p>A container is an element wrapper around your cards. Most common use is to give your card sets a background and padding around all of the cards. </p>
                    </InfoModal>
                    </h5>
                    <Collapsible accordion>
                        <CollapsibleItem header={<b style={{ textAlign: "center", width: "60%" }}>Container</b>}
                            icon={<i className="material-icons">dashboard</i>} >
                            <div className='componentEditor'>
                                <Row>
                                    <StyleModal trigger={
                                        <Col style={{ marginBottom: 15 }} s={12}><a style={{ textDecoration: "underline" }}>What do these mean?</a></Col>
                                    } />
                                    {containerOptions.map((value, index) => {
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
                       <p>The card selector allows you to add your pre-made cards into to set. Text is available to change by clicking on it. </p>
                    </InfoModal>
                    </h5>
                    <Collection className="card-collection">
                        {renderCardSelectors()}
                    </Collection>
                    <InsertCard {...props} trigger={
                        <Button icon={<Icon className="right">add</Icon>} className="btn btn-primary full-width">Insert Card</Button>
                    } />

                </div>
            </div></React.Fragment>
    }
    const handleSave = () => {
        props.setUnsaved();
        saveSet(id, props.sets)
            .then(_ => props.addMessage({ message: "Set Saved Successfully!", type: 1 }))
            .catch(_ => props.addMessage({ message: "Error Saving Cards!", type: 2 }))
    }
    function renderToptoolbar() {
        return <div>
            <Button 
                icon={<Icon className="right">code</Icon>} 
                onClick={_ => setCodeOpen(true)} 
                style={{ lineHeight: "12px" }} 
                className="btn btn-outline" >
                    VIEW CODE
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
            <Modal header='Card Comments'
                trigger={<Button icon={<Icon className="right">comments</Icon>} className="btn btn-primary">Comments</Button>}>
                <CommentBox usersID={props.auth.user.id}
                    url={`/comments/card/'${id}/${name}/${props.auth.user.id}`}
                    pollInterval={2000} />
            </Modal>
            {!isOwner && <Button icon={<Icon className="right">save</Icon>} onClick={_ => {
                copySet(props.auth.user.id, props.sets).then(_ => {
                    props.addMessage({ message: "Card set copied to your Library!", type: 1 })
                })
                .catch(_=>props.addMessage({message:"Error saving Card", type: 2}))
            }} className="btn btn-primary"
                type="submit" tooltip="Save current card changes">
                Save to Library
                </Button>}
            {isOwner && <React.Fragment><Button className="btn btn-primary"
                onClick={e => handleSave(e)}
                icon={<Icon className="right">save</Icon>}
                type="submit" tooltip="Save current card changes">
                Save
                </Button>
                <Modal
                    fixedFooter={true}
                    header='View Code'
                    options={{
                        onCloseEnd: _ => setCodeOpen(false),
                    }}
                    open={codeOpen}>
                    <SetOutput open={codeOpen} sets={props.sets} />
                </Modal>
                <Modal
                    header='Settings'
                    fixedFooter={true}
                    trigger={<Button icon={<Icon className="right">settings</Icon>} className="btn btn-primary" >Settings</Button>}>
                    <h5>Card Name</h5>
                    <TextInput id="set-name-3" className="bordered" onChange={e => props.setName(e.target.value)} value={props.sets.name} placeholder="Card Name" />
                    <h5>Card Description</h5>
                    <Textarea className="bordered"
                        placeholder="Card Description"
                        onChange={e => props.setDescription(e.target.value)}
                        value={props.sets.description}
                    />
                    <TagSelector tags={props.sets.tags} setTags={props.setTags} />
                    <TagDisplay tags={props.sets.tags} setTags={props.setTags} deleteable={true} />
                    <h5>Card Visibility</h5>
                    <p>Select wheter you want the card to be visible to all users of the app or keep it private if you don't
                    want others to see your card design! Make sure you hit save to update the cards visibility permanently.
                    This can be changed at anytime. When using the "Save As" feature you can set the new cards visibility
           from here, whatever the current state is, is what the new cards visibility will be set to.</p>
                    <p><b>Current state:</b> {props.sets.visibility}</p>
                    <Button onClick={_ => props.setVisibility("private")} className="btn-primary">Turn Off</Button>
                    <Button onClick={_ => props.setVisibility("public")} className="btn-primary">Turn On</Button>
                </Modal></React.Fragment>}
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
                    return <div key={index} style={styles} />
                case "Title":
                    return <h1 suppressContentEditableWarning={true}
                        onBlur={e => props.setText(cardId, index, e.currentTarget.textContent)}
                        contentEditable
                        key={index}
                        style={{ ...styles, ...advancedStyles, cursor: "text" }}>
                        {styles.text}
                    </h1>
                case "Button":
                    return <button key={index} style={styles}>{styles.text}</button>
                case "Paragraph":
                    //Same as Title
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
            <div style={{ ...props.sets.container }}>
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
            scrollHidden = {false}
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