import React, { useEffect } from 'react';
import {  Tab, Tabs } from 'react-materialize';
import { generateFlippableCard, generateSingleCard } from '../Code/CodeGenerator'
import { addMessage } from '../actions/toastActions.js'
import './CardOutput.css';
import {html, css, js} from 'js-beautify'
import Prism from 'prismjs';
import '../Code/prism.css';
import { connect } from 'react-redux';

function CardOutput(props) {
    if (!props.open)
        return null;
    let backEnabled = props.editor.backEnabled;
    let card = backEnabled ? generateFlippableCard(props.editor)
        : generateSingleCard(props.editor)
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
                                {css(card.css.content[0].css)}
                            </code>
                            <code className='language-css'>
                                {backEnabled && css(card.css.content[1].css)}
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
)(CardOutput);