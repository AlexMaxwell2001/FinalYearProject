import React, { useState } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';
import 'materialize-css';
import { Link, useHistory } from 'react-router-dom'
import { loadCards } from "../api/CardsAPI"
import { connect } from "react-redux";
import { addMessage } from '../actions/toastActions';
import { setCards } from '../actions/cardActions';
import AddCard from '../components/AddCard';
import '../Dashboard/Dashboard.css'
import { openDrawer } from '../actions/uiActions'
import AddSet from '../components/AddSet';
import AddArrangement from '../components/AddArrangement';

function Dashboard(props) {
  const [open, setOpen] = useState(false);
  let history = useHistory();
  if (!props.cards.cards) {
    loadCards(props.auth.user.id)
      .then(res => {
        props.history.push("/dashboard");
        let data = res.data.allCards;
        setCards(data);
        addMessage({ message: "Cards loaded Successfully!", type: 1 })
      })
      .catch(_ => {
        props.history.push("/dashboard");
        addMessage({ message: "Error loading cards", type: 2 })
      })
  }
  const mb10 = {
    marginBottom: 10
  }
  const getIcon = (icon) => {
    return <Icon className="right">{icon}</Icon>
  }
  const outlineButton = "btn btn-outline mobile-height full-width";
  const primaryButton = "btn btn-primary mobile-height full-width"
  const THREE_PANEL = [
    {
      icon: "dashboard",
      title: "Cards",
      subtitle: "Create a whole range of UI Cards, design and export your beautiful cards.",
      addButton: <Button onClick={_ => setOpen(true)} style={mb10} icon={getIcon("add")} className={primaryButton}>CREATE</Button>,
      manageButton: <Button onClick={_ => props.openDrawer()} style={mb10} icon={getIcon("settings")} className={outlineButton}>MANAGE</Button>
    },
    {
      icon: "group_work",
      title: "Sets",
      subtitle: "Create sets of Cards, share and discover new Card Sets.",
      addButton: <AddSet onComplete={_ => history.push('/sets')} {...props} trigger={
        <Button style={mb10} icon={getIcon("add")} className={primaryButton}>CREATE</Button>
      } />,
      manageButton: <Link to="/sets">
        <Button style={mb10} icon={getIcon("settings")} className={outlineButton}>MANAGE</Button>
      </Link>
    },
    {
      icon: "view_carousel",
      title: "Arrangements",
      subtitle: "Arrange your Card Sets in various ways like a Stack or a Grid.",
      addButton: <AddArrangement onComplete={_ => history.push('/arrangements')} {...props} trigger={
        <Button style={mb10} icon={getIcon("add")} className={primaryButton}>CREATE</Button>
      } />,
      manageButton: <Link to="/arrangements">
        <Button style={mb10} icon={getIcon("settings")} className={outlineButton}>MANAGE</Button>
      </Link>
    }
  ]
  return <div style={{ width: '100%', height: '100vh', overflow: 'auto', paddingBottom: 20 }}>
    <div className="content-container" style={{ padding: 30, paddingBottom: 100 }}>
      <AddCard open={open} setOpen={setOpen} />
      <Row>
        <Col s={12}>
          <h2>Hi, {props.auth.user.name}.</h2>
          <h4 style={{ paddingBottom: 20 }} className=" grey-text text-darken-1">Welcome to Cards Without Code!</h4>
        </Col>
        {THREE_PANEL.map((value, index) => {
          return <Col key={index} m={12} l={4}>
            <div style={{ padding: 20 }} className="raise-element center dash-card">
              <i className="material-icons dash-display-icon">{value.icon}</i>
              <h4>
                {value.title}
              </h4>
              <p>{value.subtitle} </p>
              {value.addButton}
              {value.manageButton}
            </div>
          </Col>
        })}
      </Row>
    </div>
  </div>
}

const mapStateToProps = state => ({
  auth: state.auth,
  cards: { ...state.cards },
});


export default connect(
  mapStateToProps,
  { addMessage, setCards, openDrawer }
)(Dashboard);

