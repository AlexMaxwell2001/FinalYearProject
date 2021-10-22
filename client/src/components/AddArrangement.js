import React, {useState} from 'react'
import { Button, Icon, Modal, TextInput } from 'react-materialize';
import { newArrangement } from '../api/Arrangements';

export default function AddArrangement(props) {
    const [title, setTitle] = useState("");
    const addSet = () => {
      newArrangement(props.auth.user.id, { name: title, createdBy: props.auth.user.id, cardSet: '603ad3aa0942e33f94435538',arrangementType: '' })
      .then(_=> props.onComplete())
      .catch(_ => props.addMessage({ message: "Error adding Set", type: 2 }))
    }
    return <Modal
        header='New Arrangement'
        trigger={
            props.trigger
        }>
        <div style={{ padding: 20 }}>
            <p style={{ color: "#e83b3b" }}><b>* Required</b></p>
            <b>Arrangement Name </b><b style={{ color: "#e83b3b" }}>*</b>
            <TextInput id="set-name-1" className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter name here" />
            <Button disabled={title === ""} icon={<Icon className="right">add</Icon>} onClick={_ => addSet()} className="btn btn-primary mobile-height">CREATE ARRANGEMENT</Button>
        </div>
    </Modal>
  }