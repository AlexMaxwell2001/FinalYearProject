import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Icon, Modal, Pagination, Tab, Tabs, Textarea, TextInput } from 'react-materialize';
import { addMessage } from '../../../actions/toastActions';
import { setEditingStyle, flipCard, updateStyle,        setSaved,  updateSetTitle, cloneCard, updateSetDescription, addContent } from '../../../actions/editorActions';
import { generateFlippableCard, generateSingleCard } from '../output/CodeGenerator'
import { updateCard } from '../../../api/CardsAPI';
import CardOutput from '../output/CardOutput'
import { connect } from 'react-redux'

import './CardTemplate.css';
import { TagDisplay, TagSelector } from '../../../components/Tags';
import { loadSets, newSet, saveSet } from '../../../api/CardSets';
import { MOST_RECENT } from '../../../utils/Constants';
import { FilterDropDown, FilterPrivacy, getSort } from '../../../components/Sort';
import { useHistory } from 'react-router';

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
        <iframe  frameBorder="0" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} >
            <base target="_blank" />
            </iframe>
    );
};

function Preview(props) {
    if (!props.open)
        return null;
        let card = props.editor.backEnabled ? generateFlippableCard(props.editor)
        : generateSingleCard(props.editor)
    return <Iframe content={card.html + "<style>" + card.css.body + card.css.extras + card.css.content[0].css + card.css.content[1].css + "</style><script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script>" + "<script>" + card.js + "</script>"} />
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
    const handleSave = async e => {
        e.preventDefault();
        updateCard(props.editor._id, props.editor)
            .then(_ => { 
                props.addMessage({ message: "Card Saved Successfully!", type: "1" }) 
                props.setSaved();
            })
            .catch(_ => { props.addMessage({ message: "Failure Saving Card!", type: "1" }) })
    };
    const { id} = props.auth.user;
    let isOwner = props.editor.createdBy === id;
    return <div className="top-toolbar">
        <Button tooltip="Export your code!" style={{ lineHeight: "12px" }} icon={<Icon className="right">code</Icon>} onClick={_ => setCodeOpen(true)} className="btn btn-outline" >VIEW CODE</Button>
        <Modal
            header='View Code'
            fixedFooter={true}
            options={{
                onCloseEnd: _ => setCodeOpen(false),
            }}
            open={codeOpen}>
            <CardOutput open={codeOpen} />
        </Modal>
        <SelectSet open={setsOpen} setSetsOpen = {setSetsOpen} {...props} />
         <Button onClick={_=>setSetsOpen(true)} icon={<Icon className="right">add</Icon>} className="btn btn-primary"
                type="submit" tooltip="Add Card to a Set!">
                Add to Set
            </Button>

        <Button icon={<Icon className="right">visibility</Icon>} onClick={_ => setPreviewOpen(true)} className="btn btn-primary"
            type="submit" tooltip="Preview how your changes will look!">
            Preview
        </Button>
        {props.editor.backEnabled &&
            <Button icon={<Icon className="right">{props.editor.flipped ? "flip_to_front" : "flip_to_back"}</Icon>} onClick={_ => props.flipCard(0, !props.editor.flipped)} className="btn btn-primary"
                type="submit" tooltip="Flip the card to its front or back">
                Flip Card
        </Button>}
        {isOwner && <React.Fragment><Button icon={<Icon className="right">save</Icon>} className="btn btn-primary"
            onClick={e => handleSave(e)}
            type="submit" tooltip="Save current card changes">
            Save
        </Button>
            <Modal
                header='Settings'
                trigger={<Button icon={<Icon className="right">settings</Icon>} className="btn btn-primary" >Settings</Button>}>
                <h5>Card Name</h5>
                <TextInput id="set-name-2" onChange={e => props.updateSetTitle(e.target.value)} value={props.editor.label} placeholder="Card Name" />
                <h5>Card Description</h5>
                <Textarea
                    placeholder="Card Name"
                    value={props.editor.description}
                    onChange={e => props.updateSetDescription(e.target.value)}
                />
            </Modal></React.Fragment>}
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
                return <a href="#"><button className = {className} onMouseEnter={_=>setMouseOverStyle(index)} onClick={_=>props.setEditingStyle({id: index, face:source})} key={index} style={{...styles, ...advancedStyles}}>
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
        flipCard,
        setEditingStyle
    })(CardsView);

