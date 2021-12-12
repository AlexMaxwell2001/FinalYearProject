import React,{useState} from 'react'
import { Button, Modal, Icon } from "react-materialize";
import { loadUsers } from '../api/UsersAPI';
import WarningModal from './WarningModal';
import { saveSet } from '../api/CardSets';
export default function AddCollaborators(props) {
    const [users, setUsers] = useState([-1])
    const [contributors, setContributors] = useState([-1])
    const [userFilter, setUserFilter]= useState("")
    const loadingUsers = () => {
        loadUsers().then(res => {
            setUsers(res.data.users)
        })
    }
    const loadingContributors = () => {
        setContributors(props.cardEditor.contributors.split(","))
    }
    if ( users[0] === -1)
        loadingUsers()
    if ( contributors[0] === -1)
        loadingContributors()

    let removeUser =(username) => {
        var contributors= props.cardEditor.contributors.replace(username+",", "")
        props.cardEditor.contributors=contributors
        saveSet(props.cardEditor._id,props.cardEditor)
        loadingContributors()
        loadingUsers()
    }

    let addUser =(username) => {
        var contributors= props.cardEditor.contributors + username +","
        props.cardEditor.contributors=contributors
        props.cardEditor.visibility="public"
        saveSet(props.cardEditor._id,props.cardEditor)
        loadingContributors()
        loadingUsers()
    }


    const renderUsers = () => users
        .filter(v => { return !props.cardEditor.contributors.includes(v.username) && v.username && v.username.toLowerCase().includes(userFilter.toLowerCase())})
        .map((value, index) => {
            if(value.username === props.username)return <React.Fragment></React.Fragment>
            return <div style={{ padding: 10 }} className="card-grid-item" key={index}>
                <b>{value.username}</b>
                <Button onClick={_ => {addUser(value.username)}} tooltip="Add User" className="btn-small hoverable btn-primary right" style={{ height: 30, width: 30, padding: 0 }} icon={<Icon>add</Icon>}></Button>
            </div>
    })
    const renderContributors = () => contributors
        .map((value, index) => {
            if(value.length<2){
                return <React.Fragment></React.Fragment>
            } 
            else   return <div style={{ padding: 10 }} className="card-grid-item" key={index}>
                    <b>{value}</b>
                    <WarningModal 
                        warningText="This will remove this user, Are you sure?"
                        action_name="Remove" title="Remove User" 
                        continueAction={_ => {removeUser(value)}} 
                        trigger={
                            <Button tooltip="Remove User" 
                                className="btn-small hoverable btn-primary right" 
                                style={{ height: 30, width: 30, padding: 0 }} 
                                icon={
                                    <Icon>delete</Icon>
                                }>
                            </Button>
                        } 
                    />
                </div>         
    })
    return <Modal
        height="100%"
        actions={[
            <React.Fragment><Button style={{marginRight: 10, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} modal="close" className="btn-danger" node="button">Cancel</Button>
            </React.Fragment>
        ]}
        trigger={
            props.trigger
        }>
        <h4>Add Contributors</h4><br></br>
        <div className="card-grid-container">
                    <b style={{ fontSize: 18 }}>Contributors:</b>
                    {props.cardEditor.contributors.length === 0 &&
                        <React.Fragment>
                        <h5>No Contributors!</h5>
                        <hr></hr>
                        </React.Fragment>}
                    {props.cardEditor.contributors.length>2 && renderContributors()}
                    <br></br>
        </div>
        <div className="card-grid-container">
                    <b style={{ fontSize: 18 }}>Search Users:</b>
                    <input value={userFilter} 
                        onChange={e => setUserFilter(e.target.value)} 
                        className="bordered" 
                        placeholder="User's username" 
                        type="text" />
                    {!users.length && 
                        <React.Fragment>
                            <h5>No Users found!</h5>
                        </React.Fragment>
                    }
                    {users.length && renderUsers()}
                </div>
    </Modal>
}