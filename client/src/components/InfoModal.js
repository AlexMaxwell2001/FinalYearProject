import React from 'react'
import { Button, Modal } from "react-materialize";

export default function InfoModal(props) {
    return <Modal
        header={props.title}
        height="100%"
        actions={[
            <Button style={{fontWeight: "bold"}} flat modal="close" node="button">Close</Button>
        ]}
        trigger={
            props.trigger
        }>
        <div style={{ padding: 20, textAlign:"left"}}>
            <div style={{fontSize:18}}>
            {props.children}
            </div>
        </div>
    </Modal>
}