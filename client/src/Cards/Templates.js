import React, { useState } from 'react';
import 'materialize-css';
import { connect } from "react-redux";
import { deleteCard } from "../api/CardsAPI"
import { logoutUser } from "../actions/authActions";
import { MOST_RECENT } from '../utils/Constants'
import { newCard, SelectTemplate } from '../actions/editorActions';
import { FilterDropDown, getSort } from '../components/Sort';
import { addMessage } from '../actions/toastActions';
import { Button, Tab, Tabs, Icon, Pagination } from 'react-materialize';
import { useHistory } from 'react-router-dom';
import { removeCard, setCards } from '../actions/cardActions';
import WarningModal from '../components/WarningModal';

function Templates(props) {
    const [sort, setSort] = useState(MOST_RECENT)
    const [nameFilter, setNameFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const { user } = props.auth;
    let history = useHistory();
    const openCard = (id) => {
        props.closeDrawer()
        history.push("/edit-card?id=" + id);
    }
    let removeCard =(id) => {
        deleteCard(id)
            .then(_ => {
                props.addMessage({ message: "Card Deleted Successfully", type: 1 })
                props.removeCard(id)
            })
            .catch(_ => props.addMessage({ message: "Error deleting Card", type: 2 }))
    }
    let pageSize = 10
    let pageStart = (currentPage - 1) * pageSize;
    let defaultCards = props.cards.cards.cards.filter(cards => cards.createdBy === "root");
    let myCards = props.cards.cards.cards.filter(cards => cards.createdBy === user.id);
    const renderDefaultCards = () => defaultCards.map((value, index) => {
        return <div onClick={_ => {openCard(value._id)}} 
                    className="card-grid-item" key={index}>
                    <h5><b>{value.name}</b></h5>
                    <p>{value.description}</p>
                </div>
    })
    const renderMyCards = () => myCards
        .filter(v => { return v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase())})
        .sort((a, b) => getSort(a, b, sort))
        .slice(pageStart, pageStart + pageSize)
        .map((value, index) => {
            return <div style={{ padding: 10 }} className="card-grid-item" key={index}>
                <b>{value.name}</b>
                <Button onClick={_ => openCard(value._id)} tooltip="Edit Card" className="btn-small waves-effect waves-light hoverable btn-primary right" style={{ height: 30, width: 30, padding: 0 }} icon={<Icon>edit</Icon>}></Button>
                <WarningModal 
                    warningText="This will delete your Card permanently. Are you sure?"
                    action_name="Delete" title="Delete Card" 
                    continueAction={_ => {removeCard(value._id)}} 
                    trigger={
                        <Button tooltip="Delete Card" 
                            className="btn-small waves-effect waves-light hoverable btn-primary right" 
                            style={{ height: 30, width: 30, padding: 0 }} 
                            icon={
                                <Icon>delete</Icon>
                            }>
                        </Button>
                    } 
                />
            </div>
    })
    return <div style={{ padding: 20, textAlign: "center" }} className='components'>
        <h3 className="black-text">Card Library</h3>
        <Tabs className='tab-demo z-depth-1'>
            <Tab title="Templates">
                <div className="card-grid-container-smaller">
                    {renderDefaultCards()}
                </div>
            </Tab>
            <Tab title="My Cards">
                <div className="card-grid-container">
                    <b style={{ fontSize: 18 }}>Search:</b>
                    <input value={nameFilter} 
                        onChange={e => setNameFilter(e.target.value)} 
                        className="bordered" 
                        placeholder="Card Name" 
                        type="text" />
                    <FilterDropDown sort={sort} setSort={setSort} />
                    {!myCards.length && 
                        <React.Fragment>
                            <h5>No Cards Yet!</h5>
                            <h5>Try adding a new card.</h5>
                        </React.Fragment>
                    }
                    {renderMyCards()}
                    <Pagination
                        activePage={currentPage}
                        onSelect={page => setCurrentPage(page)}
                        items={(myCards.length / pageSize) + 1}
                        leftBtn={<Icon>chevron_left</Icon>}
                        maxButtons={8}
                        rightBtn={<Icon>chevron_right</Icon>}
                    />
                </div>
            </Tab>
        </Tabs>
    </div>
}

const mapStateToProps = state => ({
    auth: state.auth,
    cards: { ...state.cards },
    editor: { ...state.styles }
});


export default connect(
    mapStateToProps,
    { logoutUser, SelectTemplate, newCard, addMessage, setCards, removeCard }
)(Templates);