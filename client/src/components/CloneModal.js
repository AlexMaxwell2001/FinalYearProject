import React,{useState} from 'react'
import { Button, Modal } from "react-materialize";
import { useHistory } from 'react-router-dom'
import { addCard } from '../api/CardsAPI'
export default function CloneModal(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    let history = useHistory();
    const newCardWithTemplate = (card, title, description, uuid) => {
        let cardCopy = {...card, description, createdBy: uuid, name: title, visibility: "private"};
        addCard(uuid, cardCopy)
          .then(res => {
            setTitle("");
            setDescription("");
            history.push("/edit-card?id=" + res.data.updated._id);
          })
      }
    return <Modal
        height="100%"
        actions={[
            <React.Fragment><Button style={{marginRight: 10, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} modal="close" className="btn-danger" node="button">Cancel</Button>
            <Button  disabled={title === "" || description === ""} style={{marginRight: 20, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} onClick={_ => {newCardWithTemplate(props.cardEditor, title, description, props.usersID)}} className="btn-primary" modal="close" node="button">{props.action_name}</Button></React.Fragment>
        ]}
        trigger={
            props.trigger
        }>
        <div>
            <div>
            <i style={{fontSize:45}} className="material-icons">content_copy</i><span style={{fontSize:45 ,paddingLeft: 200, paddingRight:150}}> Clone this card!</span>
            <p style={{color:"#e83b3b"}}><b>* Required</b></p>
            <b>Card Name </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Card Name"/>
            <b>Card Description </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Card Description"/>
            <h5>{props.cloneText}</h5>
            </div>
        </div>
    </Modal>
}