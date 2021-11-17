import React from 'react'
import { Col } from 'react-materialize'
export default function EditorLayout(props) {
    const colStyling1 = {
        style: {
            padding: 0,position: "absolute", right: 0
        },
        className: 'paneGradient'
    }
    const colStyling2 = {
        style: {
            padding: 0
        },
        className: 'paneGradient'
    }
    let overflow = props.scrollHidden ? "hidden" : "auto"
    return <React.Fragment>
        <Col {...colStyling2} s={9}>
            <div className="top-toolbar">
                {props.top_toolbar}
            </div>
            <div style={{ overflow, height: "calc(100vh - 120px)" }}>
                {props.children}
            </div>
        </Col>
        <Col {...colStyling1}s={3}>
            <div className="tool-bar-wrapper">
                {props.toolbar}
            </div>
        </Col>
    </React.Fragment>
}