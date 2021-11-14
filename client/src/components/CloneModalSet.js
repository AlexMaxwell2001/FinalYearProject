import React,{useState} from 'react'
import { Button, Modal } from "react-materialize";
import { useHistory } from 'react-router-dom'
import { copySet } from '../api/CardSets';
function reverseString(str) {
    if (str === "") // This is the terminal case that will end the recursion
      return "";
    
    else
      return reverseString(str.substr(1)) + str.charAt(0);
  }
export default function CloneModalSet(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    let history = useHistory();
    const newSets = (id, set) => {
        var reverse = reverseString(JSON.stringify(set))
        reverse =reverse.replace("}","")
        set=reverseString(reverse)
        set= set +",\"name\": \""+  title +  "\" , \"description\": \"" +description +"\" , \"visibility\": \"private\" }"
        console.log(set)
        copySet(id, JSON.parse(set))
          .then(res => {
            setTitle("");
            setDescription("");
            history.push("/edit-set?id=" + res.data.updated._id);
            window.location.reload()
        })
      }
    return <Modal
        height="100%"
        actions={[
            <React.Fragment><Button style={{marginRight: 10, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} modal="close" className="btn-danger" node="button">Cancel</Button>
            <Button  disabled={title === "" || description === ""} style={{marginRight: 20, marginLeft: 10, paddingLeft: 30, paddingRight: 30, marginBottom:40}} onClick={_ => {newSets(props.usersID, props.cardEditor)}} className="btn-primary" modal="close" node="button">{props.action_name}</Button></React.Fragment>
        ]}
        trigger={
            props.trigger
        }>
        <div>
            <div>
            <i style={{fontSize:45}} className="material-icons">content_copy</i><span style={{fontSize:45 ,paddingLeft: 200, paddingRight:150}}> Clone this Set!</span>
            <p style={{color:"#e83b3b"}}><b>* Required</b></p>
            <b>Set Name </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Set Name"/>
            <b>Set Description </b><b style={{color:"#e83b3b"}}>*</b>
            <input className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Set Description"/>
            <h5>{props.cloneText}</h5>
            </div>
        </div>
    </Modal>
}