import React from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { resetEditorState } from "../../actions/editorActions";
import AccountCircle from "../AccountCircle";


function LoggedInNav(props) {
  const onLogoutClick = _ => {
    props.resetEditorState();
    props.logoutUser();
  };
  return <React.Fragment>
    {props.children}
    <AccountCircle userName={props.auth.user.name} logout={onLogoutClick}/>
    </React.Fragment>
}

function NavContent(props) {
  let logo = <Link to="/" className="col s5 brand-logo center black-text">
        <i className="material-icons">code</i>
        <span className="big-logo hide-on-small-only">Cards Without Code</span>
        <span className="small-logo hide-on-med-and-up">CWC</span>
      </Link>
  return props.auth.isAuthenticated ? <LoggedInNav {...props}>{logo}</LoggedInNav> : logo
}

function Navbar(props) {
  return <div className="navbar-fixed">
    <nav className="nav-wrapper white">
      <NavContent {...props} />
    </nav>
  </div>
}

const mapStateToProps = state => ({
  auth: state.auth,
  editor: { ...state.styles }
});


export default connect(
  mapStateToProps,
  { logoutUser, resetEditorState }
)(Navbar);
