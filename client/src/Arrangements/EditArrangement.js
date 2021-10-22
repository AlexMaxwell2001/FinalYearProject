import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal,  TextInput,  Icon, Collapsible, CollapsibleItem, Pagination, Switch } from 'react-materialize';
import { connect } from 'react-redux'
import {getSet, loadSets } from '../api/CardSets';
import LoaderCircle from '../components/LoaderCircle';
import { addMessage } from '../actions/toastActions';
import { generateStack, generateGrid } from '../Code/CodeGenerator';
import { getArrangement, saveArrangement } from '../api/Arrangements';
import { 
    resetArrangements, setArrangement, setResponsive, setUnsaved, switchSet, updateColSpacing,
    updateGridValue, updateMinWidth, updateRowSpacing, updateTitle, updateType 
} from '../actions/arrangementActions';
import ArrangeOutput from './ArrangeOutput';
import { FilterDropDown, FilterPrivacy, getSort } from '../components/Sort';
import { MOST_RECENT } from '../utils/Constants';
import { Prompt, useHistory } from 'react-router';
import WarningModal from '../components/WarningModal';
import EditorLayout from '../Layout/EditorLayout';
import { css, html, js } from 'js-beautify';
import InfoModal from '../components/InfoModal';


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
        <iframe frameBorder="0" title="preview" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} />
    );
};

function Preview(props) {
    if (!props.open)
        return null;
    let {arrangementType, grid} = props.arrangements.config[0];
    let {cards, container} = props.arrangements.set[0];
    let card = arrangementType === "stack" ?
         generateStack({...props.arrangements.set[0], gridEnabled:false}) :
         generateGrid(props.arrangements.config[0], grid, cards, container)
    return <Iframe content={
                card.html 
                + "<style>" 
                + css(card.css.container) 
                + css(card.css.wrapper) 
                + css(card.css.body) 
                + css(card.css.extras) 
                + css(card.css.content) 
                + css(card.css.content.css) 
                +  "</style><script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script>" 
                + "<script>" 
                + js(card.js) 
                + "</script>"
            } />
}


function SelectSet(props) {
    const [sets, setSets] = useState([]);
    const [nameFilter, setNameFilter] = useState("")
    const [filterPrivacy, setFilterPrivacy] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState(MOST_RECENT)
    let pageStart = (currentPage-1)*20;
    if(props.open)
        return null;
    useEffect(_=> {
        loadSets(props.auth.user.id).then(res => {
            setSets(res.data.allCards.filter(value=>value.createdBy === props.auth.user.id));
        })
    }, [])
    return <Modal
    trigger={
        props.trigger
    }>
    <div style={{ padding: 20}}>
        <h4 style={{textAlign:"left"}}>My Card Sets</h4>
            <b style={{fontSize:18, marginBottom:10}}>Search:</b>
            <input style={{marginBottom:15}} value={nameFilter} onChange={e=>setNameFilter(e.target.value)} className="bordered" placeholder="Set Name" type="text" id="TextInput-NF"/>
            <div style={{display:"flex", marginBottom:15}}>
                <FilterDropDown sort={sort} setSort={setSort}/>
                <FilterPrivacy sort={filterPrivacy} setSort={setFilterPrivacy}/>
            </div>
        
            <div style={{marginTop:15, marginBottom:25}} >
        {sets.filter(v => {
                            
                            return v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase());
                        }).sort((a,b) =>  getSort(a,b, sort)).slice(pageStart, pageStart + 20).map((value, index) => {
            return props.arrangements.set ? <WarningModal key={index} warningText="Changing set will remove all previous grid or stack configurations" action_name = "Continue" title="Delete Arrangement" continueAction={_=>props.changeSet(value._id)} trigger = {
            <div key={index} style={{padding: 10, marginBottom:10}} className="card-grid-item">
                <b>{value.name}</b>
                </div>
            }/> : 
            <div onClick={_=>props.changeSet(value._id)} key={index} style={{padding: 10, marginBottom:10}} className="card-grid-item">
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
</Modal> 
}

function SelectType(props) {
    return <Modal
    trigger={
        props.trigger
    }>
    <div style={{ padding: 20 }}>
        <h5>Arrangement Type</h5>
        <div className="card-grid-container">
        <div onClick={_=> {
            props.updateType("stack")
            
            }} style={{textAlign:"center", padding:50}} className="card-grid-item">
                <i style={{fontSize:40}} className="material-icons dash-display-icon">filter_none</i>
                <h5><b>Stack</b></h5>
                <p>Arrange your cards in a traversable Card Stack!</p>
                </div>
                <div onClick={_=>props.updateType("grid")} style={{textAlign:"center", padding:50}}  className="card-grid-item">
                <i style={{fontSize:40}} className="material-icons dash-display-icon">grid_view</i>
                <h5><b>Grid</b></h5>
                <p>Arrange your cards in a Grid using CSS Grid!</p>
                </div>
        </div>
    </div>
</Modal> 
}

function GridModal(props) {
    return <Modal
    fixedFooter={true}
    trigger={
        props.trigger
    }>
    <div style={{ padding: 20, fontSize:18}}>
        <h5>Grid Options</h5>
        <p>The grid is split up into 12 columns horizontally. To specify where you want the card to be positioned, use <b>'Col Start', 'Col End', 'Row Start', 'Row End'.</b></p>
        <p> For example, if I position a card at  <b>Col Start 1</b> and <b>Col End 6</b>,the card will take up the grid's first half. Likewise, with <b>Col Start 6</b> and <b>Col End 12</b>, the card will take up the second half of the grid.</p>
        <p> <b>Row Start</b> and <b>Row End</b> are a way of specifying what row your card will sit on and how many rows it will take up in the grid.</p>
        <a target="new" href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Realizing_common_layouts_using_CSS_Grid_Layout#a_flexible_12-column_layout">See More</a>
        <h5>Overrides</h5>
        <p>Overrides allow you to change the properties of cards within the grid editor. Any value changed will overwrite the corresponding value on the card.</p>
        <p><b>Width:</b> Card Width</p>
        <p><b>Height:</b> Card Height</p>
    </div>
</Modal> 
}

function GridConfuration(props) {
    const {grid, row_spacing, col_spacing, min_width, responsive} = props.arrangements.config[0];
    let DEFAULT_SPACING = "15px"
    let DEFAULT_MIN_WIDTH = "250px"
    return <React.Fragment>
        <h5>
            Responsive Width
                <InfoModal title="Responsive Width" trigger={
                <span className="material-icons right card-toolbar-help">
                    help
                        </span>
            }>
                <p>With responsive width turned on, your cards will fill the width of your container as much as possible. To set which point the cards will get pushed to the next row, use the field "Minimum Width". For example, setting this to 250px, the cards will fill available space until their width reaches 250px. When the card's width goes below 250px, The grid will push card/cards to the next row to make more space.</p>
                <p>You can place each card individually into corresponding rows and columns with responsive turned off. It will create a flexible grid layout where each card will fill up the desired row and column length with responsive turned off. For example, if I have two cards, one from columns 1-6 and one from columns 6-12, with both cards on row 1. Both cards will be on the same row and take up 50% of the container width.</p>
            </InfoModal>
        </h5>
    <Switch
    id="Switch-11"
    offLabel="Off"
    checked={responsive}
    onChange={_ => { props.setResponsive(!responsive) }}
    onLabel="On"
  />
    
    <h5>
            Spacing
                <InfoModal title="Spacing" trigger={
                <span className="material-icons right card-toolbar-help">
                    help
                        </span>
            }>
                <p>Spacing allows you to add gaps between rows and columns. For example, if I add 10px column spacing, there will be 10 pixels separating each pair of cards horizontally. The same goes for rows.</p>
                <p><b>Column Gap</b>: How much horizontal spacing is between your cards.</p>
                <p><b>Column Gap</b>: How much vertical spacing is between your cards.</p>
            </InfoModal>
        </h5>
<Row>
    <TextInput id="row-gap" onChange={e=>{props.updateRowSpacing(e.target.value)}} 
        value={row_spacing || DEFAULT_SPACING} label="Row Gap" s={12} m={6}/>
    <TextInput id="col-gap"  onChange={e=>{props.updateColSpacing(e.target.value)}} 
        value={col_spacing || DEFAULT_SPACING} label="Column Gap"s={12} m={6}/>
  </Row>
  {responsive && <Row>
    <TextInput id="min-width"  onChange={e=>{props.updateMinWidth(e.target.value)}} label="Minimum Width" value={min_width || DEFAULT_MIN_WIDTH}  s={12}/>
  </Row>}
  {!responsive && <React.Fragment>
    <h5>
            Positioning
                <InfoModal title="Positioning" trigger={
                <span className="material-icons right card-toolbar-help">
                    help
                        </span>
            }>
                <p>Positioning allows you to define exactly where each card will be positioned in the grid. The grid is split up into 12 columns and any number of rows. To configure a card position, select your card below and enter your values. </p>
            </InfoModal>
        </h5>
    <Collapsible accordion>
     {props.arrangements.set.length && props.arrangements.set[0].cards.map((value,index) => {
         let gridItem = grid.find(item=>item.id === index);
         const checkValue = (name) => {
             if(!gridItem || !gridItem[name])
             return "";
             else return gridItem[name];
         }
        return <CollapsibleItem key={index} 
            header={
                <div style={{display:"flex",width:"100%"}}>
                    <b>{value.name}</b>
                </div>
            }>
            <Row>
                    <GridModal trigger = {
                        <Col style={{marginBottom:15}} s={12}><a style={{textDecoration: "underline"}}>What do these mean?</a></Col>
                    }/>
                    <TextInput id={index + "cs"} value={checkValue("col_start")} onChange={e=>props.updateGridValue(index, "col_start", e.target.value)}  s={6} label="Column Start"></TextInput>
                    <TextInput id={index + "ce"} value={checkValue("col_end")} onChange={e=>props.updateGridValue(index, "col_end", e.target.value)}s={6} label="Column End"></TextInput>
                    <TextInput id={index + "rs"} value={checkValue("row_start")} onChange={e=>props.updateGridValue(index, "row_start", e.target.value)}s={6}label="Row Start"></TextInput>
                    <TextInput id={index + "re"} value={checkValue("row_end")} onChange={e=>props.updateGridValue(index, "row_end", e.target.value)}s={6}label="Row End"></TextInput>
                    
                    <h5>Overrides</h5>
                    
                    <TextInput id={index + "w"} value={checkValue("width")}  onChange={e=>props.updateGridValue(index, "width", e.target.value)} s={6} label="Width"></TextInput>
                    <TextInput id={index + "h"} value={checkValue("height")}  onChange={e=>props.updateGridValue(index, "height", e.target.value)} s={6} label="Height"></TextInput>
                    </Row>
                </CollapsibleItem>
    })}
    </Collapsible></React.Fragment>}</React.Fragment>
}

function EditArrangements(props) {
    const [codeOpen, setCodeOpen] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    let history = useHistory();
    
    let id = new URLSearchParams(props.location.search).get("id")
    const loadCardSets = () => {
        getArrangement(id)
            .then(res => {
                props.setArrangement({...res.data});
                
            })
            .catch(_=> {
                history.push("/dashboard")
                props.addMessage({ message: "Assignment is deleted or does not exist!", type: 2 })
            })
    }
    useEffect(_=> {
        loadCardSets()
         return () => {
             props.resetArrangements();
         };
    }, [id])
    const changeSet = (id) => {
        getSet(id).then(res => {
            props.switchSet(res.data.allCards[0]);
        })
    }
    if (!props.arrangements.config)
        return <LoaderCircle />
    const {arrangementType, name} = props.arrangements.config[0];
    let dataExists = !!props.arrangements.set && !!props.arrangements.set[0];
    function renderToolbar() {
        return <React.Fragment><nav className="bg-primary">
        <div style={{ display: 'flex', paddingLeft: 20 }} className="nav-wrapper">
            <h5 className="truncate" style={{ lineHeight: "32px" }}>{name}</h5>
        </div>
        </nav>
        <div className='console'>
            <div className='console-content'>
            <SelectSet changeSet={changeSet}  trigger={
                <Button className="btn btn-primary full-width" onClick={_=>setSelectOpen(true)}>Select Set</Button>
            } {...props}/>
            {!!dataExists && props.arrangements.config && <React.Fragment>
            <SelectType changeSet={changeSet} id={id} {...props} trigger = {
                <Button className="btn btn-primary full-width">Select Type</Button>
            }/></React.Fragment>}
            {arrangementType === "grid" && <GridConfuration {...props}/>}
            </div>
        </div></React.Fragment>
    }
    const handleSave = () => {
        props.setUnsaved();
        saveArrangement(id, props.arrangements.config[0]).then(_ => {
            props.addMessage({message: "Arrangement Saved Successfully!", type: 1})
        })
        .catch(_=> {
            props.addMessage({message: "Error Saving Arrangement!", type: 2})
        })
    }
    function renderToptoolbar() {
        return <div>
                <Button icon={<Icon className="right">code</Icon>} onClick={_=>setCodeOpen(true)} style={{lineHeight:"12px"}} className="btn btn-outline" >VIEW CODE</Button>
                <Button className="btn btn-primary" 
                    onClick={_=>handleSave()}
                    icon={<Icon className="right">save</Icon>}
                    type="submit" tooltip="Save current card changes">
                    Save
                </Button>
                <Modal
                    header='View Code'
                    options={{
                        onCloseEnd: _ => setCodeOpen(false),
                    }}
                    open={codeOpen}>
                    <ArrangeOutput open={codeOpen} {...props}/>
                </Modal>
                <Modal
                    header='Settings'
                    trigger={<Button icon={<Icon className="right">settings</Icon>} className="btn btn-primary" >Settings</Button>}>
                    <h5>Arrangement Name</h5>
                    <TextInput onChange={e=>props.updateTitle(e.target.value)} value={props.arrangements.config[0].name} className="bordered"  placeholder="Card Name" />
                </Modal>
        </div>
    }
    function renderCards() {
        return <React.Fragment>
            {(props.arrangements.config[0].cardSet.length && props.arrangements.config[0].arrangementType === "stack") && <Preview open {...props}/>}
            {(props.arrangements.config[0].cardSet.length && props.arrangements.config[0].arrangementType === "grid") && 
                props.arrangements.set.length  && <Preview open {...props}/>
            }
        </React.Fragment>
    }
    return <React.Fragment>
    {selectOpen && <SelectSet {...props}/>}
        <EditorLayout
            scrollHidden
            top_toolbar={renderToptoolbar()}
            toolbar={renderToolbar()}>
            {renderCards()}
        </EditorLayout>
    </React.Fragment>
}

const mapStateToProps = state => ({
    auth: {...state.auth},
    arrangements: state.arrangements
});


export default connect(
    mapStateToProps,
    { setArrangement, switchSet, addMessage, updateTitle, updateType,
        setResponsive, updateGridValue, setUnsaved, resetArrangements, updateRowSpacing,
        updateColSpacing, updateMinWidth }
)(EditArrangements);