import React from 'react'
import { Modal } from "react-materialize";

export default function StyleModal(props) {
    return <Modal
      trigger={
        props.trigger
      }>
      <div style={{ padding: 20, fontSize:18 }}>
        <h5>Styles</h5>
        <p>Styles allow you to add CSS styles to your content! To add a style, pick out the style you want to use and enter a value</p>
        <p>The values follow standard form for CSS styles.</p>
        <p>For example, to set a background image, you pick out the <b>"Background Image"</b> option and enter <b>"url('my-image-url.com/image')" in the textbox.</b></p>
        <p>If you <b>cant find the style you are looking for</b>, be sure to check out <b>"Advanced Styles"</b></p>
        <p>For more information on CSS properties <a target="new" href="https://www.w3schools.com/cssref/">See More</a></p>
      </div>
    </Modal>
  }
  