import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-materialize';
import 'materialize-css';
import CardsView from '../card/CardsView';
import { SelectTemplate, resetEditorState } from '../../../actions/editorActions';
import LoaderCircle from '../../../components/LoaderCircle';

import Toolbar from "../toolbar/Toolbar.js"
import { connect } from 'react-redux'
import { getCard } from '../../../api/CardsAPI';
import { Prompt, useHistory } from 'react-router';
import { addMessage } from '../../../actions/toastActions';

function EditCard(props) {
  let id = new URLSearchParams(props.location.search).get("id")
  let history = useHistory();
  const [loading, setLoading] = useState(true)
  useEffect(_ => { // on mount
    loadCardSets()
    return () => { // on unmount
      props.resetEditorState();
    }
  }, [id]) //On load and if card id changes
  const loadCardSets = () => {
    setLoading(true);
    getCard(id)
      .then(res => {
        props.SelectTemplate(res.data.allCards[0])
        setLoading(false);
      })
      .catch(_ => {
        history.push("/dashboard")
        props.addMessage({ message: "Card has been deleted or does not exist!", type: 2 })
      })
  }
  const colStyling = {
    style: {
      padding: 0
    },
    className: 'paneGradient'
  }
  if (loading || !props.editor.body)
    return <LoaderCircle />
  return <React.Fragment>
    <Col {...colStyling} s={9}>
      <div>
        <CardsView />
      </div>
    </Col>
    <Col style={{
      ...colStyling.style,
      position: "absolute",
      right: 0,
      minWidth: "220px"
    }} s={3}>
      <Toolbar />
    </Col>
  </React.Fragment>
}

const mapStateToProps = state => ({
  auth: state.auth,
  editor: { ...state.styles }
});


export default connect(
  mapStateToProps,
  { SelectTemplate, resetEditorState, addMessage }
)(EditCard);