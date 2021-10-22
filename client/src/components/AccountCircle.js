import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-materialize';
function AccountCircle(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropRef = useRef(null);
    const toggleActive = _ => {
        if (!showDropdown && dropRef) {
            setShowDropdown(!showDropdown);
            setTimeout(() => {
                dropRef.current.focus();
            }, 100);
        }
    }
    const onBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    }
    function clickListItem(clickType) {
        return (e) => {
            e.stopPropagation()
            switch (clickType) {
                case 'logout':
                    props.logout();
                    break;
                case 'settings':
                    //Todo: settings modal
                    break;
                default:
                    console.warn('INVALID clickType', clickType)
                    break;
            }
        }
    }
    return <React.Fragment>
        <div className="accountTool right" onClick={toggleActive}>
            <div className="userSettings">
                {getInitials(props.userName)}
            </div>
            <Icon>arrow_drop_down</Icon>
            {showDropdown && <div autoFocus ref={dropRef} style={{right: 60, top: 70}} tabIndex="0" onBlur={onBlur} className="dropdown-menu show">
                <li className="dropdown-item" 
                    onClick={clickListItem('logout')}> 
                    <Icon>power_settings_new</Icon> 
                    <p style={{ display: "inline" }}>
                        Logout
                    </p>
                </li>
            </div>}
        </div>
    </React.Fragment>
}

export default connect(null)(AccountCircle)


function getInitials(name) {
    let names = name.split(' ');
    return names[0][0] + (names[1] ? names[1][0] : '');
}