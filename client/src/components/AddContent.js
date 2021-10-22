import React from 'react'
import {Modal} from 'react-materialize';


export default function AddContent(props) {
    const { cardId, front, addContent } = props;
    let data = [
      { value: 'Title', label: 'Title', icon: "title" },
      { value: 'Seperator', label: 'Seperator', icon:"maximize" },
      { value: 'Button', label: 'Button', icon:"smart_button" },
      { value: 'Image', label: 'Image', icon:"image" },
      { value: 'Paragraph', label: 'Paragraph', icon: "short_text" },
      { value: 'Link Button', label: 'Link Button', icon: "link" }
    ]
    return <Modal
      header='Add Element'
      fixedFooter={true}
      trigger={
        props.trigger
      }>
      <div style={{ padding: 20 }}>
        <div className="card-grid-container-small">
          {data.map((value, index) => {
            return <div onClick={_ => { addContent(cardId, front, 0, value.value) }}
                     style={{textAlign:"center"}} className="card-grid-item" key = {index}>
                  <i className="material-icons grey-text text-darken-3" style={{fontSize: 50}}>{value.icon}</i>
                  <h5 className="grey-text text-darken-3"><b>{value.label}</b></h5>
              </div>
          })}
        </div>
      </div>
    </Modal>
  }
