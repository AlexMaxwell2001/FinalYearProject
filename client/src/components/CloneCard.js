import React, { useState } from 'react'
import { Button, Icon, Modal} from 'react-materialize'
import {addCard as newCard} from '../actions/cardActions'
import { addMessage } from '../actions/toastActions'
import { connect } from 'react-redux'


function CloneCard(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  if(!props.cards)
    return null;
  return <Modal
    header='Save this template as a card'
    fixedFooter={true}
    style={{ textAlign: "left" }}
    options={{
      onCloseEnd: _ => props.setOpen(false),
    }}
    open={
      props.open
    }>
    <p style={{color:"#e83b3b"}}><b>* Required</b></p>
    <b>Card Name </b><b style={{color:"#e83b3b"}}>*</b>
    <input className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Card Name"/>
    <b>Card Description </b><b style={{color:"#e83b3b"}}>*</b>
    <input className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Card Name"/>
    <Button disabled={title === "" || description === ""} style={{ marginTop: 10 }}
      onClick={_ => {
       // savetheCard();
      }}
      modal="close"
      icon={<Icon className="right">save</Icon>}
      className="btn btn-primary mobile-height full-width">
      Save Card
        </Button>
  </Modal>
}

const mapStateToProps = state => ({
  auth: state.auth,
  cards: state.cards.cards
});

export default connect(
  mapStateToProps,
  { addMessage, newCard }
)(CloneCard);