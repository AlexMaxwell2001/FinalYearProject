import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { removeMessage } from "../actions/toastActions";



function Toast(props) {
    if (!props.errors || !props.errors.messages.length)
        return null
    const [shown, setShown] = useState(true);
    let message = props.errors.messages[0];
    let duration = 300;
    useEffect(() => {
        setTimeout(() => {
            if (shown)
                setShown(false);
        }, 3000)
    });
    const defaultStyle = {
        transition: `top ${duration}ms ease-in-out`,
        top: 0 + (0 * 100),
        position: "absolute",
        height: 50,
        minWidth: 200,
        maxWidth: 100,
        left: 0,
        right: 0,
        margin: "auto",
        lineHeight: "27px",
        zIndex: 10004
    }
    const transitionStyles = {
        entering: { top: 50 },
        entered: { top: 50 },
        exiting: { top: -100 },
        exited: { top: -100 },
    };
    let className = (message.type === 1 ? "light-text white-text green accent-6" : "light-text white-text red accent-6")
    return <Transition onExited={_ => props.removeMessage(0)} in={shown} timeout={duration}>
        {state => (
            <div className={className}
                style={{ ...defaultStyle, ...transitionStyles[state], textAlign: "left", top: 50, minWidth: 400, padding: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 5, boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14)" }}>
                <i onClick={_ => setShown(false)} className="material-icons left">info</i>
                <span style={{ fontWeight: 600 }}>{message.message}</span>
                <i style={{ cursor: "pointer" }} onClick={_ => setShown(false)} className="material-icons right">cancel</i>
            </div>
        )}
    </Transition>
}

const mapStateToProps = state => ({
    errors: { ...state.errors },
});

export default connect(
    mapStateToProps, { removeMessage })(Toast);