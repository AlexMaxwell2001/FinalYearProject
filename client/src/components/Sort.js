import React, { useState, useRef } from 'react'
import { Icon } from 'react-materialize'
import {A_Z, Z_A, MOST_RECENT, LEAST_RECENT} from '../utils/Constants'

export const privacyFinder = (value, privacyFilter) => {
    if (privacyFilter === 2)
        return value.visibility === "public"
    if (privacyFilter === 3)
        return value.visibility === "private"
    else return true;
}

export function FilterPrivacy(props) {
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
    const setSort = (id) => {
        setShowDropdown(false);
        props.setSort(id);
    }
    const getSortName = () => {
        switch(props.sort) {
            case 1:
                return "All"
                case 2:
                    return "Public"
                    case 3:
                return "Private"
            default:
                return "All"
        }
    }
    return <div style={{position:"relative"}}>
        <span onClick={toggleActive} className="chip bold">Privacy: {getSortName()}<Icon className="right chip-icon">arrow_drop_down</Icon></span>
        {showDropdown && <div autoFocus ref={dropRef} tabIndex="0" onBlur={onBlur} className="dropdown-menu show">
                <li onClick={_=>setSort(1)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10 }}>
                        All
                    </p>
                </li>
                <li onClick={_=>setSort(2)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10}}>
                        Public
                    </p>
                </li>
                <li onClick={_=>setSort(3)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10}}>
                        Private
                    </p>
                </li>
            </div>}
    </div>
}

export function FilterDropDown(props) {
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
    const setSort = (id) => {
        setShowDropdown(false);
        props.setSort(id);
    }
    const getSortName = () => {
        switch(props.sort) {
            case A_Z:
                return "A-Z"
                case Z_A:
                    return "Z-A"
                    case MOST_RECENT:
                return "Most Recent"
                case LEAST_RECENT:
                    return "Least Recent"
            default:
                return "Most Recent"
        }
    }
    return <div style={{position:"relative"}}>
        <span onClick={toggleActive} className="chip bold">Sort: {getSortName()}<Icon className="right chip-icon">arrow_drop_down</Icon></span>
        {showDropdown && <div autoFocus ref={dropRef} tabIndex="0" onBlur={onBlur} className="dropdown-menu show">
                <li onClick={_=>setSort(MOST_RECENT)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10 }}>
                        Most Recent
                    </p>
                </li>
                <li onClick={_=>setSort(LEAST_RECENT)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10}}>
                        Least Recent
                    </p>
                </li>
                <li onClick={_=>setSort(A_Z)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10}}>
                        A-Z
                    </p>
                </li>
                <li onClick={_=>setSort(Z_A)} className="dropdown-item" > 
                    <p style={{ display: "inline", paddingLeft:10}}>
                        Z-A
                    </p>
                </li>
            </div>}
    </div>
}

export function getSort(a,b, sort) {
    switch(sort) {
        case A_Z:
        case Z_A:
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x > y) return sort === A_Z ? 1 : -1
            if (x < y) return sort === A_Z ? -1 : 1
            else return 1;
        case MOST_RECENT:
            let isBefore = new Date(a.updatedAt) < (new Date(b.updatedAt));
            return isBefore ? 1 : -1
        case LEAST_RECENT:
                let isAfter = new Date(a.updatedAt) > (new Date(b.updatedAt));
                return isAfter ? 1 : -1
        default:
            return 0
    }
}
