import React, { useState } from 'react'
import { Button, Icon, Modal} from 'react-materialize'
import { addCard, loadCards } from '../api/CardsAPI'
import {addCard as newCard} from '../actions/cardActions'
import { addMessage } from '../actions/toastActions'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'


function AddCard(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([-1])
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const { user } = props.auth;
  let history = useHistory();
  const loadingCards = () => {
    loadCards().then(res => {
      setCards(res.data.allCards.filter(cards => {
            return cards.createdBy === "root"
      }))
  })
  }
  const newCardWithTemplate = (card, title, description, uuid) => {
    let cardCopy = {...card, description, createdBy: uuid, name: title};
    addCard(uuid, cardCopy)
      .then(res => {
        props.addMessage({ message: "Card Created Successfully!", type: 1 })
        props.newCard(res.data.updated);
        setTitle("");
        setSelectedTemplate(0);
        setDescription("");
        history.push("/edit-card?id=" + res.data.updated._id);
      })
      .catch(err => props.addMessage({ message: err, type: 1 }))
      loadingCards()
  }
  if (cards[0] === -1)
  loadingCards()
  return <Modal
    header='New Card'
    fixedFooter={true}
    style={{ textAlign: "left" }}
    options={{
      onCloseEnd: _ => props.setOpen(false),
    }}
    open={
      props.open
    }>
    <h5>Configuration</h5>
    <p style={{color:"#e83b3b"}}><b>* Required</b></p>
    <b>Card Name </b><b style={{color:"#e83b3b"}}>*</b>
    <input className="bordered" value={title} onChange={e => setTitle(e.target.value)} placeholder="Card Name"/>
    <b>Card Description </b><b style={{color:"#e83b3b"}}>*</b>
    <input className="bordered" value={description} onChange={e => setDescription(e.target.value)} placeholder="Card Description"/>
    <h5>Templates</h5>
    <div className="card-grid-container-wide">
      {cards.map((value, index) => {
        let isSelected = selectedTemplate === index;
        let className = isSelected ? "full-width btn-primary mobile-height bold" : "full-width btn-outline mobile-height"
        let text = isSelected ? "Selected" : "Select"
        return <div className="card-grid-item" key={index}>
          <h5 className="text-left"><b>{value.label}</b></h5>
          <p>{value.description}</p>
          <Button onClick={_ => setSelectedTemplate(index)} className={className}>{text}</Button>
        </div>
      })}
    </div>
    <Button disabled={title === "" || description === ""} style={{ marginTop: 10 }}
      onClick={_ => {
        newCardWithTemplate(cards[selectedTemplate], title, description, user.id)
      }}
      modal="close"
      icon={<Icon className="right">add</Icon>}
      className="btn btn-primary mobile-height full-width">
      Add Card
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
)(AddCard);