import React from "react";
import {connect} from 'react-redux'
import { Link } from "react-router-dom";

function Landing(props) {
  if (props.auth.isAuthenticated) {
    props.history.push("/dashboard");
  }
  const linksStyle = {
    width: "140px",
    borderRadius: "3px",
    letterSpacing: "1.5px"
  }
  return (
    <div style={{ height: "75vh" }} className="valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          <h4>
            <b>Welcome</b> to Cards Without Code!
          </h4>
          <p className="flow-text grey-text text-darken-1">
            Get started creating cards with a selection of card templates already provided to use in your own projects.
          </p>
          <br />
          <div className="col s6">
            <Link to="/register"
              style={linksStyle}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3">
              Register
            </Link>
          </div>
          <div className="col s6">
            <Link to="/login"
              style={linksStyle}
              className="btn btn-large btn-flat waves-effect white black-text">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  null
)(Landing);