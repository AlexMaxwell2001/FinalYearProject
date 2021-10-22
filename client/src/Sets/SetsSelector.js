import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Tabs, Tab, Pagination, Icon, Row, Col } from 'react-materialize'
import { MOST_RECENT } from '../utils/Constants'
import { loadSets, deleteSet } from '../api/CardSets'
import LoaderCircle from '../components/LoaderCircle';
import { FilterDropDown, FilterPrivacy, getSort, privacyFinder } from '../components/Sort';
import { TagDisplay } from '../components/Tags'
import { addMessage } from '../actions/toastActions'
import WarningModal from '../components/WarningModal'
import AddSet from '../components/AddSet'


function SetsSelector(props) {
    const [sets, setSets] = useState([-1])
    const [publicSets, setPublicSets] = useState([])
    const [nameFilter, setNameFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState(MOST_RECENT)
    const [privacyFilter, setPrivacyFilter] = useState(1)
    const [loading, setLoading] = useState(false)
    const loadCardSets = () => {
        setLoading(true);
        loadSets(props.auth.user.id).then(res => {
            setSets(res.data.allCards.filter(card => {
                return card.createdBy === props.auth.user.id
            }))
            setPublicSets(res.data.allCards.filter(card => {
                return card.createdBy !== props.auth.user.id
            }))
            setLoading(false);
        })
            .catch(_ => props.addMessage({ message: "Error loadubg Sets", type: 2 }))
    }
    const removeSet = (id) => {
        deleteSet(id).then(_ => {
            let newSets = sets;
            newSets = newSets.filter(set => set._id !== id);
            setSets(newSets);
            props.addMessage({ message: "Set deleted Successfully", type: 1 })
        }).catch(err => {
            props.addMessage({ message: "Error:" + err, type: 2 })
        })
    }
    if (!loading && sets[0] === -1)
        loadCardSets()
    if (loading)
        return <LoaderCircle />
    let pageStart = (currentPage - 1) * 10;
    return <div style={{ width: '100%', height: '100vh', overflow: 'auto', paddingBottom: 20 }}>
        <div className="content-container" style={{ padding: 50 }}>
            <Row>
                <Col s={12} m={9}>
                    <h2 style={{ margin: 0 }}>Card Sets</h2>
                    <h5>Select a card set to begin editing!</h5>
                </Col>
                <Col s={12} m={3}>
                    <AddSet onComplete={_=>loadCardSets()} {...props}trigger={
                        <Button style={{ width: 200, marginTop: 20 }} icon={<Icon className="right">add</Icon>} className="btn btn-primary mobile-height right">NEW CARD SET</Button>
                    } />
                </Col>
            </Row>
            <div className="raise-element" style={{ backgroundColor: "white", width: "100%", marginTop: 20 }}>
                <Tabs className='tab-demo z-depth-1'>
                    <Tab title="My Sets" >
                        <div style={{ padding: 20 }}>
                            <b style={{ fontSize: 18, marginBottom: 10 }}>Search:</b>
                            <input style={{ marginBottom: 17, marginTop: 5 }} value={nameFilter} onChange={e => setNameFilter(e.target.value)} className="bordered" placeholder="Set Name" type="text" id="TextInput-S3" />
                            <div style={{ display: "flex" }}>
                                <FilterDropDown sort={sort} setSort={setSort} />
                                <FilterPrivacy sort={privacyFilter} setSort={setPrivacyFilter} />
                            </div>
                            <div style={{ marginBottom: 30, marginTop: 15 }}>
                                {sets.filter(v => {
                                    return privacyFinder(v, privacyFilter) && v.name && v.name.toLowerCase().includes(nameFilter.toLowerCase());
                                }).sort((a, b) => getSort(a, b, sort)).slice(pageStart, pageStart + 10).map((value, index) => {
                                    return <div key={index} style={{ padding: 10, marginBottom: 15, marginTop: 10 }} className="raise-element square">
                                        <b style={{ color: '#535353', fontSize: 18, paddingLeft: 10 }}>{value.name}</b>
                                        <Link key={index + value._id} to={"/edit-set?id=" + value._id}>
                                            <Icon className="right">edit</Icon>
                                        </Link>
                                        <WarningModal warningText="This will delete your Set permanently. Are you sure?" action_name="Delete" title="Delete Set" continueAction={_ => removeSet(value._id)} trigger={
                                            <i className="material-icons right" onClick={_ => removeSet(value._id)} >delete</i>
                                        } />
                                    </div>
                                })}
                            </div>
                            <Pagination
                                activePage={currentPage}
                                onSelect={page => setCurrentPage(page)}
                                items={(sets.length / 10) + 1}
                                leftBtn={<Icon>chevron_left</Icon>}
                                maxButtons={8}
                                rightBtn={<Icon>chevron_right</Icon>}
                            />
                        </div>
                    </Tab>
                    <Tab title="Public Sets" >
                        <div className="card-grid-container-small">
                            {publicSets.map((value, index) => {
                                return <Link key={index + value._id} to={"/edit-set?id=" + value._id}>
                                    <div style={{ color: '#676767' }} className="card-grid-item" key={index}>
                                        <h5><b>{value.name}</b></h5>
                                        <p>{value.description}</p>
                                        <TagDisplay tags={value.tags} setTags={null} deleteable={false} />
                                    </div>
                                </Link>
                            })}
                        </div>
                    </Tab>
                </Tabs>
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
)(SetsSelector);