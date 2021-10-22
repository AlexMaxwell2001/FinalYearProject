
import React, { useState } from "react";
import { Button, TextInput, Modal, Icon } from "react-materialize";
import { newSet } from "../api/CardSets";
import { TagDisplay, TagSelector } from "./Tags";

export default function AddSet(props) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const addSet = () => {
      newSet(props.auth.user.id, { name: title, description, createdBy: props.auth.user.id, tags })
        .then(_=> {
            props.addMessage({message:"Set created successfully", type: 1})
            props.onComplete()
        })
        .catch(_=>props.addMessage({message:"Error adding Set", type: 2}))
    }
    return <Modal
            header='New Card Set'
            trigger={
                props.trigger
            }>
            <div style={{ padding: 20 }}>
                <p style={{ color: "#e83b3b" }}><b>* Required</b></p>
                <b>Card Set Name</b><b style={{ color: "#e83b3b" }}>*</b>
                <TextInput id="set-title-3" className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Set Name" />
                <b>Card Set Description</b><b style={{ color: "#e83b3b" }}>*</b>
                <TextInput id="set-desc-3" className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                <TagSelector tags={tags} setTags={setTags} />
                <TagDisplay tags={tags} setTags={setTags} deleteable />
                <Button icon={<Icon className="right">add</Icon>} disabled={title === "" || description === ""} onClick={_ => addSet()} className="btn btn-primary mobile-height">CREATE CARD SET</Button>
            </div>
        </Modal>
  }