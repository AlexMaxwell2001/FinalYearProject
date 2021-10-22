import React, { useState, useEffect } from 'react'

function LoadingScreen() {
    return <div className="preloader-wrapper big active loader">
        <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
                <div className="circle">
                </div>
            </div>
            <div className="gap-patch">
                <div className="circle">
                </div>
            </div>
            <div className="circle-clipper right">
                <div className="circle">
                </div>
            </div>
        </div>
    </div>;
}

function LoaderWrapper(props) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!loaded)
            setLoaded(true);
    })
    return !loaded ? <LoadingScreen /> : <React.Fragment>{props.children}</React.Fragment>
}

function withLoader(WrappedComponent) {
    return function () {
        return <LoaderWrapper>
            <WrappedComponent />
        </LoaderWrapper>
    }
}

export default withLoader