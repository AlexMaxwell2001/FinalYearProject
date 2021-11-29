import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Icon, Modal, Pagination, Tab, Tabs, Textarea, TextInput } from 'react-materialize';
import { addMessage } from '../actions/toastActions';
import {
     setEditingStyle, flipCard, undoContent,redoContent, updateStyle, setSaved,  updateSetTitle,
     cloneCard, updateSetDescription, addContent 
} from '../actions/editorActions';
import CommentBox from '../components/comments/CommentBox';
import {
    getRedo, getUndo
} from '../reducers/editorReducer';
import {saveCard} from '../actions/cardActions'
import { generateFlippableCard, generateSingleCard } from '../Code/CodeGenerator'
import { updateCard} from '../api/CardsAPI';
import CardOutput from './CardOutput'
import { connect } from 'react-redux'
import './CardTemplate.css';
import { TagDisplay, TagSelector } from '../components/Tags';
import { loadSets, newSet, saveSet } from '../api/CardSets';
import { MOST_RECENT } from '../utils/Constants';
import { FilterDropDown, FilterPrivacy, getSort } from '../components/Sort';
import { useHistory } from 'react-router';
import CloneModal from '../components/CloneModal'
import WarningModal from '../components/WarningModal'




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
        <iframe title="title" frameBorder="0" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} >
            <base target="_blank" />
            </iframe>
    );
};

function Preview(props) {
    if (!props.open)
        return null;
        let card = props.editor.backEnabled ? generateFlippableCard(props.editor)
        : generateSingleCard(props.editor)
    return <Iframe content={card.html + '<style>' + card.css.body + card.css.extras + card.css.content[0].css + card.css.content[1].css + "</style><script src=${https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script><script>" + card.js + '</script>'} />
}

function AddSet(props) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [openAfter, setOpenAfter] = useState(false);
    const [description, setDescription] = useState("");
    let history = useHistory();
    const addSet = () => {
        newSet(props.userId, { name: title, description, createdBy: props.auth.user.id, tags, cards: [props.editor] })
            .then(res => {
                props.addMessage({ message: "Set created successfully", type: 1 })
                if(openAfter)
                    history.push('/edit-set?id=' + res.data.updated._id)
                else props.setSetsOpen(false);
            })
            .catch(_=>props.addMessage({message:"Error adding Set", type: 2}))
    }
    return <div style={{ paddingTop: 30 }}>
        <h4 style={{textAlign:"left"}}>Create a Set</h4>
        <p style={{color:"#e83b3b"}}><b>* Required</b></p>
        <b>Set Name </b><b style={{color:"#e83b3b"}}>*</b>
        <input style={{marginBottom:20}} value={title} onChange={e=>setTitle(e.target.value)} className="bordered" placeholder="Set Name" type="text"/>
        <b>Set Description</b><b style={{color:"#e83b3b"}}>*</b>
        <input style={{marginBottom:20}} value={description} onChange={e=>setDescription(e.target.value)} className="bordered" placeholder="Set Description" type="text"/>
        <TagSelector tags={tags} setTags={setTags} />
        <TagDisplay tags={tags} setTags={setTags} deleteable />
        <div>
        <Checkbox
            id="Checkbox_3"
            value="Open After"
            label="Open on completion"
            onChange={_=>setOpenAfter(!openAfter)}
            />
            <p></p>
        <Button disabled={title === "" || description === ""} icon={<i className="material-icons right">add</i>} onClick={_ => addSet()} className="btn btn-primary mobile-height">CREATE CARD SET</Button>
        </div>
    </div>
}


function SelectSet(props) {
    const [sets, setSets] = useState([]);
    const [nameFilter, setNameFilter] = useState("")
    const [openAfter, setOpenAfter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState(MOST_RECENT)
    const [filterPrivacy, setFilterPrivacy] = useState(1)
    let pageStart = (currentPage-1)*20;
    let history = useHistory();
    useEffect(_ => {
        loadSets(props.auth.user.id).then(res => {
            setSets(res.data.allCards.filter(value => value.createdBy === props.auth.user.id));
        })
        .catch(_=>props.addMessage({message:"Error loading Sets", type: 2}))
    }, [])
    let addCardToSet = (set) => {
        let newSet = set;
        set.cards.push(props.editor);
        saveSet(set._id, newSet).then(_ => {
            props.addMessage({ message: "Card added to Set Successfully!", type: 1 })
            if(openAfter)
                history.push('edit-set?id=' + set._id)
            else props.setSetsOpen(false);
        })
            .catch(_ => {
                props.addMessage({ message: "Error Saving Cards!", type: 2 })
            })
    }
    let privacyFinder = (value) => {
        if(filterPrivacy === 2)
            return value.visibility === "public"
        if(filterPrivacy === 3)
            return value.visibility === "private"
        else return true;
    }
    const renderBody = () => {
        return <Tabs className='tab-demo z-depth-1'>
            <Tab title="Existing Set" >
            <React.Fragment> 
            <div style={{textAlign:"left",paddingTop:30}}>
                <h4 style={{textAlign:"left"}}>Choose existing Set</h4>
                <b style={{fontSize:18, marginBottom:10}}>Search:</b>
                <input style={{marginBottom:15}} value={nameFilter} onChange={e=>setNameFilter(e.target.value)} className="bordered" placeholder="Set Name" type="text" id="TextInput-SNF"/>
                <div style={{display:"flex", marginBottom:15}}>
                    <FilterDropDown sort={sort} setSort={setSort}/>
                    <FilterPrivacy sort={filterPrivacy} setSort={setFilterPrivacy}/>
                </div>
                <Checkbox
                id="Checkbox_4"
                value="Open After"
                label="Open on completion"
                onChange={_=>setOpenAfter(!openAfter)}
                />
                <div style={{marginTop:15, marginBottom:25}} >
                {!sets.length && <div style={{textAlign:"center"}} className="card-grid-item"><h5>No Card Sets!</h5><p>Create a new Set to continue.</p></div>}
                {sets.filter(v => {
                        
                        return privacyFinder(v.visibility) && v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase());
                    }).sort((a,b) =>  getSort(a,b, sort)).slice(pageStart, pageStart + 20).map((value, index) => {
                        return <div key={index} onClick={_ => addCardToSet(value)} style={{padding: 10, marginBottom:10}} className="card-grid-item">
                            <b>{value.name}</b>
                        </div>
                    })}
                </div>
                <Pagination
                    activePage={currentPage}
                    onSelect = {page=>setCurrentPage(page)}
                    items={(sets.length/20) + 1}
                    leftBtn={<Icon>chevron_left</Icon>}
                    maxButtons={8}
                    rightBtn={<Icon>chevron_right</Icon>}
                    />
                    </div>
                </React.Fragment>
                </Tab>
                <Tab title="New Set" >
                    <AddSet {...props} />
                </Tab>
                </Tabs>
    }
    return <Modal
    fixedFooter={true}
        open={props.open}
        options={{
            onCloseEnd: () => props.setSetsOpen(false)
        }}
        >
            {renderBody()}
    </Modal>

}
function ActionBar(props) {
    const [codeOpen, setCodeOpen] = useState(false);
    const [setsOpen, setSetsOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const handlePublicSave = (context) => {
        if(context === "private"){
            props.editor.visibility="public"
        }
        else{
            props.editor.visibility="private"
        }
        updateCard(props.editor._id, props.editor)
        window.location.reload();
    }
    const handleSave = async e => {
        e.preventDefault();
        updateCard(props.editor._id, props.editor)
            .then(_ => { 
                props.addMessage({ message: "Card Saved Successfully!", type: 1 }) 
                props.setSaved();
                props.saveCard(props.editor._id, props.editor);
            })
            .catch(e => { props.addMessage({ message: "Failure Saving Card!" + e, type: 2 }) })
    };
    const { id} = props.auth.user;
    let { name } = props.editor;
    let isOwner = props.editor.createdBy === id;
    let cardID = new URLSearchParams(window.location.search).get("id")
    var undoFlag=true;
    var redoFlag=true;
    if(!getUndo())undoFlag=false;
    if(!getRedo())redoFlag=false;
    return <div className="top-toolbar">
        <Button tooltip="Export your card!" style={{ lineHeight: "12px" }} icon={<Icon className="right">code</Icon>} onClick={_ => setCodeOpen(true)} className="btn btn-outline" >
            <span className="hide-on-small-only">Export Card</span>
        </Button>
        <Modal
            header='Export Card'
            fixedFooter={true}
            options={{
                onCloseEnd: _ => setCodeOpen(false),
            }}
            open={codeOpen}>
            <CardOutput open={codeOpen} />
        </Modal>
        <SelectSet open={setsOpen} setSetsOpen = {setSetsOpen} {...props} />
         <Button onClick={_=>setSetsOpen(true)} icon={<Icon className="right">group_work</Icon>} className="btn btn-primary"
                type="submit" tooltip="Add Card to a Set!">
                <span className="hide-on-small-only">Add to Set</span>
            </Button>

        <Button icon={<Icon className="right">visibility</Icon>} onClick={_ => setPreviewOpen(true)} className="btn btn-primary"
            type="submit" tooltip="Preview how your changes will look!">
             <span className="hide-on-small-only">Preview</span>
        </Button>
        {props.editor.backEnabled &&
            <Button icon={<Icon className="right">{props.editor.flipped ? "flip_to_front" : "flip_to_back"}</Icon>} onClick={_ => props.flipCard(0, !props.editor.flipped)} className="btn btn-primary"
                type="submit" tooltip="Flip the card to its front or back">
                 <span className="hide-on-small-only">Flip Card</span>
        </Button>}
        {isOwner && <React.Fragment><WarningModal warningText="This will save your card and remove the history from the undo and redo stacks. Are you sure you want to save?" action_name="Save" title="Save card" continueAction={e => handleSave(e)} trigger={
            <Button icon={<Icon className="right">save</Icon>} className="btn btn-primary" onClick={e => handleSave(e)} type="submit" tooltip="Save current card changes">
                <span className="hide-on-small-only">Save</span>
            </Button>}/>
        <Modal
            header='Settings'
            trigger={
                <Button icon={<Icon className="right">settings</Icon>} className="btn btn-primary" >
                    <span className="hide-on-small-only" tooltip="Visit your settings!">Settings</span>
                </Button>
            }>
            <h5>Card Name</h5>
            <TextInput id="set-name-3" className="bordered" onChange={e => props.updateSetTitle(e.target.value)} value={props.editor.name} placeholder="Card Name" />
            <h5>Card Description</h5>
            <Textarea
                className="bordered"
                placeholder="Card Name"
                value={props.editor.description}
                onChange={e => props.updateSetDescription(e.target.value)}
            />
            <Button modal="close" style={{width: '100%'}} icon={<Icon className="right">save</Icon>} onClick={e => handleSave(e)}  className="btn btn-primary" >
                <span className="hide-on-small-only" tooltip="Save your settings!">Save Settings</span>
            </Button>
        </Modal></React.Fragment>}   
        {isOwner && <Button icon={<Icon className="right">undo</Icon>} onClick={_ => props.undoContent()} className="btn btn-primary"
            type="submit" id="undo" tooltip="Undo your last change!" disabled={undoFlag}>
             <span className="hide-on-small-only">Undo</span>
        </Button>}
        {isOwner && <Button icon={<Icon className="right">redo</Icon>} onClick={_ => props.redoContent()} className="btn btn-primary"
            type="submit" id="redo"  tooltip="Redo your last undo!" disabled={redoFlag}>
             <span className="hide-on-small-only">Redo</span>
        </Button>}
        {isOwner && 
            <WarningModal warningText="As you are saving the card as a different visibility, this will save your card and remove the history from the undo and redo stacks. Are you sure you want to save?" action_name="Save" title="Save card" continueAction={_ => handlePublicSave(props.editor.visibility)} trigger={
                <Button
                    icon={<Icon className="right">public</Icon>}
                    onClick={_ => handlePublicSave(props.editor.visibility)}
                    className="btn btn-primary" >
                    Make card {props.editor.visibility === "private"?"public":"private"}
                </Button>
            }/>
        }
        {!isOwner &&
            <CloneModal usersID={props.auth.user.id} cardEditor={props.editor} action_name="Save Card" title="Clone card"  trigger={
                <Button icon={<Icon className="right">content_copy</Icon>} className="btn btn-primary" type="submit" tooltip="Clone this card!">
                    <span className="hide-on-small-only">Clone this card!</span>
                </Button>                              
            } />
        }
        <Modal header='Card Comments'
                trigger={<Button  tooltip="Comment on this card!" icon={<Icon className="right">comments</Icon>} className="btn btn-primary">Comments</Button>}>
                <CommentBox cardEditor={props.editor} usersID={props.auth.user.id} userInfo={props.auth.user.name}
                    url={`/comments/card/'${cardID}/${name}/${props.auth.user.id}`}
                    pollInterval={2000} />
        </Modal>
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
    </div>
}

function CardsView(props) {
    const [mouseOverStyle, setMouseOverStyle] = useState(-1);
    let renderBody = (cardId, card, source) => card[source].styles.map((style, index) => {
        let className= mouseOverStyle === index ? "style-hover" : "";
        
        let advancedStyles = style.data.advancedStyles;
        if(advancedStyles)
        for (let [k, v] of Object.entries(advancedStyles)) {
            let x = k.replace(/-([a-z])/g, function (m, w) {
                return w.toUpperCase();
            });
            delete advancedStyles[k];
            advancedStyles[x] = v;
        }
        
        const { name, styles } = style.data;
        switch (name) {
            case "Image":
                return <div className = {className} onMouseEnter={_=>setMouseOverStyle(index)} onClick={_=>props.setEditingStyle({id: index, face:source})} key={index} style={{...styles, ...advancedStyles}} />
            case "Seperator":
                return <hr className = {className} onMouseEnter={_=>setMouseOverStyle(index)} onClick={_=>props.setEditingStyle({id: index, face:source})} key={index} style={{...styles, ...advancedStyles}} />
            case "Title":
                // contentEditable -> Allow direct text edit
                // - suppress warnings we know what were doing here
                // - when finished editing send updated text back to the reducer
                return <h1 suppressContentEditableWarning={true}
                className = {className}
                    onMouseEnter={_=>setMouseOverStyle(index)}
                    onBlur={e => props.updateStyle(cardId, source, index, { "text": e.currentTarget.textContent })}
                    onClick={_=>props.setEditingStyle({id: index, face:source})}
                    contentEditable
                    key={index}
                    style={{...styles, ...advancedStyles, cursor: "text"}}>
                    {styles.text}
                </h1>
            case "Button":
                return <button className = {className} onMouseEnter={_=>setMouseOverStyle(index)} onClick={_=>props.setEditingStyle({id: index, face:source})} key={index} style={{...styles, ...advancedStyles}}>
                    <span contentEditable suppressContentEditableWarning={true}
                        onBlur={e => props.updateStyle(cardId, source, index, { "text": e.currentTarget.textContent })}>{styles.text}</span>
                </button>
              case "Link Button":
                return <a href="https://google.com"><button className = {className} onMouseEnter={_=>setMouseOverStyle(index)} onClick={_=>props.setEditingStyle({id: index, face:source})} key={index} style={{...styles, ...advancedStyles}}>
                    <span contentEditable suppressContentEditableWarning={true}
                        onBlur={e => props.updateStyle(cardId, source, index, { "text": e.currentTarget.textContent })}>{styles.text}</span>
                </button></a>
            case "Paragraph":
                //Same as Title
                return <p suppressContentEditableWarning={true}
                className = {className}
                onMouseEnter={_=>setMouseOverStyle(index)}
                    onBlur={e => props.updateStyle(cardId, source, index, { "text": e.currentTarget.textContent })}
                    contentEditable
                    onClick={_=>props.setEditingStyle({id: index, face:source})}
                    key={index}
                    style={{...styles, ...advancedStyles, cursor: "text"}}>
                    {styles.text}
                </p>
            default:
                return null

        }
    })
    return <React.Fragment>
        <ActionBar {...props} />
        <div className='card-render' style={{padding:0, paddingRight:18}}>
            <div style={{width:'100%', height:'100%', overflow:'auto', padding:20}}>
                    <div onMouseLeave={_=>setMouseOverStyle(-1)} className="card-body" style={props.editor.body} >
                        
                        {renderBody(0, props.editor, (props.editor.backEnabled && props.editor.flipped) ? "back" : "front")}
                    </div>
                    </div>
            </div>
    </React.Fragment>
}

const mapStateToProps = state => ({
    editor: { ...state.styles },
    auth: { ...state.auth }
});

export default connect(
    mapStateToProps,
    {
        addMessage,
        updateCard,
        cloneCard,
        addContent,
        updateStyle,
        updateSetTitle,
        updateSetDescription,
        setSaved,
        saveCard,
        flipCard,
        undoContent,
        redoContent,
        setEditingStyle
    })(CardsView);

