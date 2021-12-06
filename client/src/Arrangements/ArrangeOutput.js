import React, { useEffect } from 'react';
import { Tab, Tabs,Icon, Button } from 'react-materialize';
import { generateStack, generateGrid } from '../Code/CodeGenerator'
import { addMessage } from '../actions/toastActions.js'
import {html, css, js} from 'js-beautify'
import Prism from 'prismjs';
import '../Code/prism.css';
import { connect } from 'react-redux';
import domtoimage from 'dom-to-image'
import saveAs from 'file-saver'

function ArrangeOutput(props) {
    if (!props.open)
        return null;
    if(!props.arrangements.set || !props.arrangements.set[0])
        return <h5>Add a Set to begin!</h5>
    let card = props.arrangements.config[0].arrangementType === "stack" ?
        generateStack({...props.arrangements.set[0], gridEnabled:false}) :
        generateGrid(props.arrangements.config[0], props.arrangements.config[0].grid, props.arrangements.set[0].cards, props.arrangements.set[0].container)

    useEffect(() => {
        Prism.highlightAll();
    });

    function DownloadImage(){
        const node= document.querySelector('.imageOutput').contentWindow.document.body.innerHTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(node, "text/html").querySelector('.cards');
        console.log(doc)
        domtoimage.toBlob(doc)
        .then(function (req, res, blob) {
            req.header('Access-Control-Allow-Origin', "*")
            console.log("here")
            window.saveAs(blob, props.arrangements.config[0].name +'.png').then(console.log("here")).catch(err => {console.log(err)});
        });
    }
    
    function DownloadSVG(){
        const node= document.querySelector('.imageOutput').contentWindow.document.body.innerHTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(node, "text/html");
        function filter (doc) {
            return (doc.tagName !== 'i');
        }
        domtoimage.toSvg(doc.body, {filter: filter})
            .then(function (dataUrl) {
                var link = document.createElement("a");
                document.body.appendChild(link);
                link.download = props.arrangements.config[0].name +".svg";
                link.href = dataUrl;
                link.target = '_blank';
                link.click();        });
    }
    console.log(props)

    return (
        <div>
            <Tabs className='tab-demo z-depth-1'>
                <Tab title="IMAGE" active>
                    <div style={{width:"50%", marginTop:100, marginLeft:190, marginRight:190,textAlign:"center"}}>
                        <Button onClick={_ => DownloadImage()}icon={<Icon className="right">import_export</Icon>} style={{borderColor:"#DFDFDF !important"}} className="btn btn-primary full-width green" type="submit" tooltip="Export as Image" disabled>
                            <span className="hide-on-small-only">Export as Image</span>
                        </Button>                     
                    </div>
                </Tab>
                <Tab title="SVG">
                    <div>
                        <Button onClick={_=> DownloadSVG()} style={{width:"50%", marginTop:100, marginLeft:190,textAlign:"center",borderColor:"#DFDFDF !important"}} icon={<Icon className="right">import_export</Icon>} className="btn btn-primary full-width green" type="submit" tooltip="Export as SVG" disabled>
                                <span className="hide-on-small-only">Export as SVG</span>
                        </Button>                     
                    </div>
                </Tab>
                <Tab title="HTML">
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
    { addMessage, saveAs }
)(ArrangeOutput);