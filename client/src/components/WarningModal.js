import React from 'react'
import { Button, Modal } from "react-materialize";

export default function WarningModal(props) {
    return <Modal
        height="100%"
        actions={[
            <React.Fragment><Button style={{fontWeight: "bold"}} flat modal="close" node="button">Cancel</Button>
            <Button onClick={props.continueAction} style={{marginRight: 20, marginLeft: 10, paddingLeft: 30, paddingRight: 30}} className="btn-danger" modal="close" node="button">{props.action_name}</Button></React.Fragment>
        ]}
        trigger={
            props.trigger
        }>
        <div style={{ padding: 20, textAlign:"center"}}>
            <div>
            <i style={{fontSize:80, color:"#cc4d4d"}} className="material-icons">warning</i>
            <h5>{props.warningText}</h5>
            </div>
        </div>
    </Modal>
}