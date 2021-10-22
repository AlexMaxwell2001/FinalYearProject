import React from 'react'
import { Col } from 'react-materialize'
export default function EditorLayout(props) {
    const colStyling = {
        style: {
            padding: 0
        },
        className: 'paneGradient'
    }
    let overflow = props.scrollHidden ? "hidden" : "auto"
    return <React.Fragment>
        <Col {...colStyling} s={9}>
            <div className="top-toolbar">
                {props.top_toolbar}
            </div>
            <div style={{ overflow, height: "calc(100vh - 120px)" }}>
                {props.children}
            </div>
        </Col>
        <Col {...colStyling} s={3}>
            <div className="tool-bar-wrapper">
                {props.toolbar}
            </div>
        </Col>
    </React.Fragment>
}