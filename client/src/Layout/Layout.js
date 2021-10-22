import React from 'react';
import { Row } from 'react-materialize';
import 'materialize-css';
import Toast from '../components/Toast';
import SideBar from './Sidebar'

function Layout(props) {
    return <div className='body-builder' >
    <Toast />
    <SideBar />
    <Row style={{ marginLeft: 70}}>
      {props.children}
    </Row>
  </div >
}

export default Layout;