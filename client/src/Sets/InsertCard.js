import React, {  useState } from 'react';
import {Modal, Icon, Pagination } from 'react-materialize';
import { loadCards } from '../api/CardsAPI';
import { MOST_RECENT } from '../utils/Constants';
import { FilterDropDown, getSort } from '../components/Sort';


export default function InsertCard(props) {
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