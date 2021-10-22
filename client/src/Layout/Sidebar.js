import React, { useState } from 'react';
import 'materialize-css';
import Templates from '../Cards/Templates';
import AddCard from '../components/AddCard';
import { useHistory } from "react-router"
import {connect} from 'react-redux'
import {closeDrawer, openDrawer, toggleDrawer} from '../actions/uiActions'


function SideBar(props) {
  const [open, setOpen] = useState(false);
    let history = useHistory()
    let redirect = (url) => {
      history.push(url);
    }
    let closeDrawerAction = (fun) => {
      props.closeDrawer();
      fun()
    }
    return <React.Fragment>
      {props.ui.drawerOpen && <React.Fragment>
        <div style={{ position: "absolute", zIndex: 1000, top: 0, marginLeft: 70, width: 500, height: "100%", backgroundColor: 'white' }}>
          <Templates closeDrawer={_ => props.closeDrawer()} />
        </div>
        <div onClick={_ => props.closeDrawer()} style={{ position: "absolute", top: 0, width: "100%", height: "100%", zIndex: 100 }}>
        </div>
      </React.Fragment>
      }
      <div className="sidebar" style={{ width: 70, top: 0, height: "100%", backgroundColor: "#508ebb",  position: "fixed", overflow:"hidden", zIndex: 1000 }}>
        <div style={{ position: "relative", height: "100%" }}>
          <div className="sidebar-btn"  onClick={_=>closeDrawerAction(_=>redirect("/dashboard"))}>
            <div className="center">
              <i className="material-icons">home</i>

              <p >Dashboard</p>
            </div>
          </div>
          <div onClick={_=>closeDrawerAction(_=>setOpen(true))} className="sidebar-btn">
              <div  className="center">
                <i className="material-icons">add</i>
                <p>Create</p>
              </div>
            </div>
          <AddCard setOpen={setOpen} open={open}/>
          <div className="sidebar-btn" onClick={_ => props.toggleDrawer()}>
            <div className="center">
              <i className="material-icons">dashboard</i>
              <p>Cards</p>
            </div>
          </div>
          <div className="sidebar-btn" onClick={_=>closeDrawerAction(_=>redirect("/sets"))}>
            <div className="center">
              <i className="material-icons">group_work</i>

              <p>Sets</p>
            </div>
          </div>
          <div className="sidebar-btn" onClick={_=>closeDrawerAction(_=>redirect("/arrangements"))}>
            <div className="center">
                <i className="material-icons">view_carousel</i>
                <p >Arrange</p>
              </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }

  const mapStateToProps = state => ({
    ui: state.ui,
});


export default connect(
    mapStateToProps,
    {closeDrawer, openDrawer, toggleDrawer}
)(SideBar);