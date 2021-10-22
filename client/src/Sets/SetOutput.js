import React, { useEffect } from 'react';
import { Tab, Tabs } from 'react-materialize';
import {  generateRegularCard } from '../Code/CodeGenerator'
import { addMessage } from '../actions/toastActions.js'
import Prism from 'prismjs';
import {html, css, js} from 'js-beautify'
import { connect } from 'react-redux';

function SetOutput(props) {
    if (!props.open)
        return null;
    let card =  generateRegularCard({...props.sets, gridEnabled:false})
    useEffect(() => {
        Prism.highlightAll();
    });
    const copyText = (ref) => {
        if (ref === "html") {
            navigator.clipboard.writeText(card.html)
            props.addMessage({ message: "Code copied to clipboard!", type: 1 })
        }
    }
    return (
        <div>
            <Tabs className='tab-demo z-depth-1'>
                <Tab title="HTML" active>
                    {/**<Button onClick={_ => copyText("html")}>Copy Text</Button>**/}
                    <div className='code'>
                        <pre>
                            <code className='language-html'>
                                {html(card.html)}
                            </code>
                        </pre>
                    </div>
                </Tab>
                <Tab title="CSS">
                    <div className='code'>
                        <pre>
                        <code className='language-css'>
                                {css(card.css.extras)}
                            </code>
                            <code className='language-css'>
                                {css(card.css.body)}
                            </code>
                            <code className='language-css'>
                                {css(card.css.container)}
                            </code>
                            <code className='language-css'>
                                {css(card.css.content)}
                            </code>
                            <code className='language-css'>
                                {css(card.css.wrapper)}
                            </code>
                        </pre>
                    </div>
                </Tab>
                <Tab title="JAVASCRIPT">
                    <div className='code'>
                        <pre>
                            <code className='language-js'>
                                {js(card.js)}
                            </code>
                            </pre>
                    </div>
                    <h5>JQuery</h5>
                    <p>This code uses JQuery. Insert this code at the end of your {'<body>'} tag.</p>
                    <div className='code'>
                        <pre style={{overflow:"auto"}}>
                        <code className='language-html'>
                        {"<script src='https://code.jquery.com/jquery-3.5.1.min.js' integrity='sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0='crossorigin='anonymous'></script>"}
                    </code>
                    </pre>
                        </div>
                </Tab>
            </Tabs>
        </div >
    )
}

const mapStateToProps = state => ({
    editor: { ...state.styles }
});

export default connect(
    mapStateToProps,
    { addMessage }
)(SetOutput);