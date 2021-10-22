import React, { useState, } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Pagination, Icon, Row, Col } from 'react-materialize'

import { deleteArrangement, loadArrangements } from '../api/Arrangements'
import LoaderCircle from '../components/LoaderCircle';
import { addMessage } from '../actions/toastActions'
import { FilterDropDown, getSort } from '../components/Sort'
import { MOST_RECENT } from '../utils/Constants'
import WarningModal from '../components/WarningModal'
import AddArrangement from '../components/AddArrangement'

function SelectArrangements(props) {
    const [arrangements, setArrangements] = useState([-1])
    const [loading, setLoading] = useState(false)
    const [nameFilter, setNameFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState(MOST_RECENT)
    const loadCardSets = () => {
        setLoading(true);
        loadArrangements(props.auth.user.id)
            .then(res => {
                setArrangements(res.data.allCards.filter(card => {
                    return card.createdBy === props.auth.user.id
                }))
                setLoading(false);
            })
            .catch(_ => props.addMessage({ message: "Error loading Sets", type: 2 }))
    }
    const removeArrangement = (id) => {
        deleteArrangement(id)
            .then(_ => {
                let newAarrangements = arrangements;
                newAarrangements = newAarrangements.filter(arrangement => arrangement._id !== id);
                setArrangements(newAarrangements);
                props.addMessage({ message: "Arrangement deleted Successfully", type: 1 })
            })
            .catch(err => {
                props.addMessage({ message: "Error:" + err, type: 2 })
            })
    }
    if (!loading && arrangements[0] === -1)
        loadCardSets()
    let pageStart = (currentPage - 1) * 10;
    if (loading)
        return <LoaderCircle />
    return <div style={{ width: '100%', height: '100vh', overflow: 'auto', paddingBottom: 20 }}>
        <div className="content-container" style={{ padding: 50 }}>
            <Row>
                <Col m={12} l={9}>
                    <h2 style={{ margin: 0 }}>Arrangements</h2>
                    <h5>Arrange your card sets in various ways!</h5>
                </Col>
                <Col m={12} l={3}>
                    <AddArrangement onComplete={_=>loadCardSets()} {...props} trigger={
                        <Button style={{ width: 200 }} icon={<Icon className="right">add</Icon>} className="btn btn-primary mobile-height right">NEW</Button>
                    } />
                </Col>
            </Row>
            <div className="raise-element" style={{ backgroundColor: "white", width: "100%", marginTop: 20 }}>
                <div className="bg-primary" style={{ height: 50, boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)" }}>
                </div>
                <div style={{ padding: 20 }}>
                    <b style={{ fontSize: 18, marginBottom: 10 }}>Search:</b>
                    <input style={{ marginBottom: 17, marginTop: 5 }} value={nameFilter} onChange={e => setNameFilter(e.target.value)} className="bordered" placeholder="Arrangement Name" type="text" id="TextInput-33" />
                    <FilterDropDown sort={sort} setSort={setSort} />
                    <div style={{ marginBottom: 30, marginTop: 15 }}>
                        {arrangements
                            .filter(v => {return v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase())})
                            .sort((a, b) => getSort(a, b, sort))
                            .slice(pageStart, pageStart + 10).map((value, index) => {
                                return <div key={index} style={{ padding: 10, marginBottom: 15, marginTop: 10 }} className="raise-element square">
                                    <b style={{ color: '#535353', fontSize: 18, paddingLeft: 10 }}>{value.name}</b>
                                    <Link to={"edit-arrangement?id=" + value._id}>
                                        <Icon className="right">edit</Icon>
                                    </Link>
                                    <WarningModal warningText="This will delete your Arrangement permanently. Are you sure?" action_name="Delete" title="Delete Arrangement" continueAction={_ => removeArrangement(value._id)} trigger={
                                        <i className="material-icons right" >delete</i>
                                    } />
                                </div>
                        })}
                    </div>
                    <Pagination
                        activePage={currentPage}
                        onSelect={page => setCurrentPage(page)}
                        items={(arrangements.length / 10) + 1}
                        leftBtn={<Icon>chevron_left</Icon>}
                        maxButtons={8}
                        rightBtn={<Icon>chevron_right</Icon>}
                    />
                </div>
            </div>
        </div>
    </div>
}


const mapStateToProps = state => ({
    auth: state.auth,
});


export default connect(
    mapStateToProps,
    { addMessage }
)(SelectArrangements);