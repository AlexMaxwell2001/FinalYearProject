import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal,  TextInput,  Icon, Collapsible, CollapsibleItem, Pagination, Switch } from 'react-materialize';
import { connect } from 'react-redux'
import {getSet, loadSets } from '../../../api/CardSets';
import LoaderCircle from '../../../components/LoaderCircle';
import { addMessage } from '../../../actions/toastActions';
import { generateStack, generateGrid } from '../output/CodeGenerator';
import { getArrangement, saveArrangement } from '../../../api/Arrangements';
import { resetArrangements, setArrangement, setResponsive, setUnsaved, switchSet, updateColSpacing, updateGridValue, updateMinWidth, updateRowSpacing, updateTitle, updateType } from '../../../actions/arrangementActions';
import ArrangeOutput from './ArrangeOutput';
import { FilterDropDown, FilterPrivacy, getSort } from '../../../components/Sort';
import { MOST_RECENT } from '../../../utils/Constants';
import { Prompt, useHistory } from 'react-router';
import WarningModal from '../../../components/WarningModal';


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

        <div style={{overflow:'hidden', height:"calc(100vh - 120px)"}}>
            {props.children}
        </div>

    </Col>
        <Col {...colStyling} s={3}>
            <div className="tool-bar-wrapper">
                {props.toolbar}
            </div>
        </Col></React.Fragment>
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
        <iframe frameBorder="0" title="preview" src="about:blank" scrolling="yes" height="100%" width="100%" ref={writeHTML} />
    );
};

function Preview(props) {
    if (!props.open)
        return null;
    let card = props.arrangements.config[0].arrangementType === "stack" ?
         generateStack({...props.arrangements.set[0], gridEnabled:false}) :
         generateGrid(props.arrangements.config[0], props.arrangements.config[0].grid, props.arrangements.set[0].cards, props.arrangements.set[0].container)
    return <Iframe content={card.html + "<style>" + card.css.container + card.css.wrapper +  card.css.body + card.css.extras + card.css.content + card.css.content.css +  "</style><script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script>" + "<script>" + card.js + "</script>"} />
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
    let privacyFinder = (value) => {
        if(filterPrivacy === 2)
            return value.visibility === "public"
        if(filterPrivacy === 3)
            return value.visibility === "private"
        else return true;
    }
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
            return props.arrangements.set ? <WarningModal warningText="Changing set will remove all previous grid or stack configurations" action_name = "Continue" title="Delete Arrangement" continueAction={_=>props.changeSet(value._id)} trigger = {
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
        <div onClick={_=>props.updateType("stack")} style={{textAlign:"center", padding:50}} className="card-grid-item">
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
    trigger={
        props.trigger
    }>
    <div style={{ padding: 20}}>
        <h5>Grid Options</h5>
        <p>The Grid is split up into 12 columns horizontally. To specify where you want the card to be positioned use <b>'Col Start', 'Col End', 'Row Start', 'Row End'.</b></p>
        <p> For example if i position a card at <b>Col Start 1</b> and <b>Col End 6</b>, the card will take up the first half of the grid. Likewise with <b>Col Start 6</b> and <b>Col End 12</b>, the card will take up the second half of the grid</p>
        <p> <b>Row Start</b> and <b>Row End</b> are a way of specifying what row your card will sit on and how many rows it will take up in the grid.</p>
        <a target="new" href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Realizing_common_layouts_using_CSS_Grid_Layout#a_flexible_12-column_layout">See More</a>
        <h5>Overrides</h5>
        <p>Overrides allow you to change properties of cards within the grid editor. Any value changed will overwrite the corresponding value on the card.</p>
        <p><b>Width:</b> Card Width</p>
        <p><b>Height:</b> Card Height</p>
    </div>
</Modal> 
}

function GridConfuration(props) {
    const {arrangementType, grid, row_spacing, col_spacing, min_width, responsive, name} = props.arrangements.config[0];
    let DEFAULT_SPACING = "15px"
    let DEFAULT_MIN_WIDTH = "250px"
    return <React.Fragment><h5>Responsive Width</h5>
    <Switch
    id="Switch-11"
    offLabel="Off"
    checked={responsive}
    onChange={_ => { props.setResponsive(!responsive) }}
    onLabel="On"
  />
    
<h5>Spacing</h5>
<Row>
    <TextInput onChange={e=>{props.updateRowSpacing(e.target.value)}} 
        value={row_spacing || DEFAULT_SPACING} label="Row Gap" s={6}/>
    <TextInput onChange={e=>{props.updateColSpacing(e.target.value)}} 
        value={col_spacing || DEFAULT_SPACING} label="Column Gap" s={6}/>
  </Row>
  {responsive && <Row>
    <TextInput onChange={e=>{props.updateMinWidth(e.target.value)}} label="Minimum Width" value={min_width || DEFAULT_MIN_WIDTH}  s={12}/>
  </Row>}
  {!responsive && <React.Fragment>
  <h5>Positioning</h5>
    <Collapsible accordion>
     {props.arrangements.set.length && props.arrangements.set[0].cards.map((value,index) => {
         let gridItem = grid[index]
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
                    <TextInput id={index + "cs"} value={checkValue("col_start")} onChange={e=>props.updateGridValue(index, "col_start", e.target.value)} s={6} label="Column Start"></TextInput>
                    <TextInput id={index + "ce"} value={checkValue("col_end")} onChange={e=>props.updateGridValue(index, "col_end", e.target.value)}s={6}label="Column End"></TextInput>
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
    const changeSet = (id) => {
        getSet(id).then(res => {
            props.switchSet(res.data.allCards[0]);
        })
    }
    useEffect(_=> {
           loadCardSets()
            return () => {
                props.resetArrangements();
            };
    }, [id])
    if (!props.arrangements.config)
        return <LoaderCircle />
    const {arrangementType, grid, row_gap, col_gap, min_width, responsive, name} = props.arrangements.config[0];
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
            <SelectType {...props} trigger = {
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