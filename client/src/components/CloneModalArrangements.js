import React,{useState} from 'react'
import { Button, Modal } from "react-materialize";
import { useHistory } from 'react-router-dom'
import { newArrangement } from '../api/Arrangements';
export default function CloneModalArrangements(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    let history = useHistory();
    const newArrangments = (id, arrangement) => {
        arrangement= JSON.stringify(arrangement).replace("_id","")
        //arrangement.createdBy= id
        console.log(id)
        console.log(arrangement)
        newArrangement(id, arrangement)
          .then(res => {
            setTitle("");
            setDescription("");
            history.push("/edit-arrangement?id=" + res.data.updated._id);
          })
      }
    return <Modal
        height="100%"
        actions={[
            <React.Fragment><Button style={{marginRight: 10, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} modal="close" className="btn-danger" node="button">Cancel</Button>
            <Button  disabled={title === "" || description === ""} style={{marginRight: 20, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} onClick={_ => {newArrangments( props.usersID, props.cardEditor)}} className="btn-primary" modal="close" node="button">{props.action_name}</Button></React.Fragment>
        ]}
        trigger={
            props.trigger
        }>
        <div>
            <div>
            <i style={{fontSize:45}} className="material-icons">content_copy</i><span style={{fontSize:45 ,paddingLeft: 160, paddingRight:150}}> Clone this Arrangement!</span>
            <p style={{color:"#e83b3b"}}><b>* Required</b></p>
            <b>Arrangement Name </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Arrangement Name"/>
            <b>Arrangement Description </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Arrangement Description"/>
            <h5>{props.cloneText}</h5>
            </div>
        </div>
    </Modal>
}