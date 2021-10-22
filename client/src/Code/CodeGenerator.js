// Author @Liam
// Turn our card configuration into code
var rename = require('deep-rename-keys');

const convertToString = (front, backEnabled, updatedCSS, editorState, cardName, index, set) => {
    let cssObj = Object.assign({}, updatedCSS); // create copy of the object
    let cssString = "";
    let css = ""
    let title = front ? ".front " : (set && editorState.flipDirection === "false" ? ".back-h" : ".back")
    let cleanName = getCleanName(cardName) + (set ? ('-' + index) : '');
    for (var key in cssObj.styles) {
        let name = cssObj.styles[key].data.name
        css = `.${cleanName} ${(backEnabled ? title : '')} ${".card" + name + "-" + key} { `;
        for (var properties in cssObj.styles[key].data.styles) {
            if (properties !== 'text' && cssObj.styles[key].data.styles[properties] !== "") {//take out the text leave the actual css props in the css string
                css += "   ";
                css += `${properties} : ${cssObj.styles[key].data.styles[properties]};`;
            }
        }
        if(cssObj.styles[key].data.advancedStyles) {
            let advancedCorrected = Object.assign({}, cssObj.styles[key].data.advancedStyles); // create copy of the object
            for (var i in advancedCorrected) {
                if (i !== 'text' && advancedCorrected[i] !== "") {//take out the text leave the actual css props in the css string
                    css += "   ";
                    css += `${i} : ${advancedCorrected[i]};`;
                }
            }
        }
        cssString += css + " }  ";

    }
    return {"css": cssString};

}

const convertBodyToString = (front, updatedCSS, cardName, index, set, backEnabled) => {
    let cssObj = Object.assign({}, updatedCSS); // create copy of the object
    let cssString = "";
    let css = ""
    let cleanName = getCleanName(cardName)  + (set ? ('-' + index) : '');
    let target = backEnabled ? `.${cleanName}, .${cleanName} .front, .${cleanName} .back, .${cleanName} .back-h { ` : `.${cleanName} { `
    if(backEnabled)
    css = `.${cleanName} { background-color:transparent!important;background-image:none!important;padding:0!important}`
        css += target;
        for (var properties in cssObj) {
            if (properties !== 'text' && properties !== "" && cssObj[properties] !== "") {//take out the text leave the actual css props in the css string
                css += "   ";
                css += properties + " : " + cssObj[properties] + ";";
            }
        }
        cssString += css + " }  ";

    
    return {"css": cssString};

}

const convertWrapperToString = (cardName, index, gridOption, responsive) => {
    let cssString = "";
    let cleanName = getCleanName(cardName) + '-' + index;
    let css = ""
        css = `.${cleanName}-wrapper { `;
        css += "position: relative;"
        css += "display: inline-table;"
        if(!responsive) {
            css += `grid-column: ${gridOption.col_start || 0} / ${parseInt(gridOption.col_end || 0)+1};`
            css += `grid-row: ${gridOption.row_start || 0} / ${parseInt(gridOption.row_end || 0)+1};`
            if(gridOption.width)
                css += `width: ${gridOption.width};`
            if(gridOption.height)
                css += `height: ${gridOption.height};`
        }
        cssString += css + " }  ";

    
    return {"css": cssString};

}

const convertContainerToString = (containerCSS) => {
    let cssObj = Object.assign({}, containerCSS); // create copy of the object
    let cssString = "";
    let css = ""
        css = `.container { `;
        for (var properties in cssObj) {
            if (properties !== 'text' && properties !== "") {//take out the text leave the actual css props in the css string
                css += "   ";
                css += properties + " : " + cssObj[properties] + ";";
            }
        }
        cssString += css + " }  ";

    
    return {"css": cssString};

}

const toClassName = (name, index) => {
    return ".card" + name + "-" + index
}

const getCleanName = (name) => {
    let allowed = /[(), ]/g
    let newName =  name.replaceAll(allowed, "_").toLowerCase()
    return newName.toLowerCase();
}

const generateJS = (editorState, index) => {
    const {backEnabled, backTrigger, frontTrigger, front, back, name} = editorState
    let js = ""
    let cleanName = getCleanName(name) + '-' + index;
    if(backEnabled) {
        let selectedFrontTrigger = front.styles[frontTrigger.id]
        let selectedBackTrigger = back.styles[backTrigger.id]
        js +=`$('.${cleanName} .front ${frontTrigger.id === 0 ? "" : toClassName(selectedFrontTrigger.data.name, frontTrigger.id)}').click(function() { flipCard(".${cleanName}"); });` +
            `$('.${cleanName} .back, .${cleanName} .back-h ${backTrigger.id === 0 ? "" : toClassName(selectedBackTrigger.data.name, backTrigger.id)}').click(function() { flipCard(".${cleanName}");  });`
    }
    return js;
}

const generateSingleJS = (editorState) => {
    const {backEnabled, backTrigger, frontTrigger, front, back, name} = editorState
    let js = ""
    if(backEnabled) {
        let selectedFrontTrigger = front.styles[frontTrigger.id]
        let selectedBackTrigger = back.styles[backTrigger.id]
        js +=`$('.front ${frontTrigger.id === 0 ? "" : toClassName(selectedFrontTrigger.data.name, frontTrigger.id)}').click(function() { flipCard(".card"); });` +
            `$('.back ${backTrigger.id === 0 ? "" : toClassName(selectedBackTrigger.data.name, backTrigger.id)}').click(function() { flipCard(".card");  });`
    }
    return js;
}

const createHTMLString = (classesObj, textObject) => {
    let outputHTML = "";
    let cssClassNames = Object.assign({}, classesObj);
    let x = 0;
    let name = ""
    for (var key in cssClassNames.styles) {
        if (x >= 0) {//this is to skip over the card body being put in again
            let content = "";
            outputHTML += "     ";
            name = cssClassNames.styles[key].data.name;
            if (name.includes("Title")) {
                outputHTML += '<h1 class="card' + name + "-" + key + '">' +
                    cssClassNames.styles[key].data.styles.text
                    + '</h1> ';
            }
            if (name.includes("Seperator")) {
                outputHTML += '<hr class="card' + name + "-" + key + '"/>'
            }
            if (name.includes("Image")) {
                outputHTML += '<img class="card' + name + "-" + key + '">' +
                    content
                    + '</img> ';
            }

            if (name.includes("Paragraph")) {
                outputHTML += '<p class="card' + name + "-" + key + '">' +
                cssClassNames.styles[key].data.styles.text
                    + '</p> ';
            }
            if (name.includes("Button")) {
                outputHTML += '<button class="card' + name + "-" + key + '">' +
                cssClassNames.styles[key].data.styles.text
                    + '</button> ';
            }

            if (name.includes("Link Button")) {
                outputHTML += '<a href="' + cssClassNames.styles[key].data.styles.href +  '">' +
                '<button class="card' + name + "-" + key + '">' +
                cssClassNames.styles[key].data.styles.text
                    + '</button></a> ';
            }
        
        }

    x++;
}

    return outputHTML;

}

function camelCaseToDash (str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

const newToCss = (css) => {
let testing = Object.assign({}, css);//make a clone of the object so we can delete stuff and not cause the app to crash
    if(testing.styles) {
    testing.styles = testing.styles.map( style => {
        let correctedAdvanced = null, correctedRegular = {}
        if(style.data.advancedStyles != undefined) {
            let newStyles = style.data.advancedStyles;
            for (let [k, v] of Object.entries(newStyles)) {
                let x = camelCaseToDash(k)
                delete newStyles[k];
                newStyles[x] = v;
            }
            correctedAdvanced = newStyles
        }
        let newS = style.data.styles;
        for (let [k2, v2] of Object.entries(newS)) {
            let x = camelCaseToDash(k2)
            correctedRegular[x] = v2;
        }
        let newStyles =  correctedAdvanced != null ? {data : {
            ...style.data,
            styles: {...correctedRegular},
            advancedStyles: {...correctedAdvanced}
        }} :
        {data : {
            ...style.data,
            styles: {...correctedRegular},
        }}
        return newStyles

    })
} else {
    let newBody = {}
        for (let [k2, v2] of Object.entries(testing)) {
            let x = camelCaseToDash(k2)
            newBody[x] = v2;
        }
    return newBody
}

    return testing;

//this will rename the keys to regular css
var updatedCSS = rename(testing, function (key) {
    if (key === 'card') return '.card';
    if (key === 'fontWeight') return 'font-weight'
    if (key === 'maxHeight') return 'max-height'
    if (key === 'cardTitle') return '.cardTitle';
    if (key === 'cardTitle2') return '.cardTitle2';
    if (key === 'cardLink Button') return '.cardLinkButton';
    if (key === 'cardParagraph1') return '.cardParagraph1';
    if (key === 'cardParagraph2') return '.cardParagraph2';
    if (key === 'cardParagraph3') return '.cardParagraph3';
    if (key === 'cardImg') return '.cardImg';
    if (key === 'cardButton') return '.cardButton';
    if (key === 'maxWidth') return 'max-width';
    if (key === 'boxShadow') return 'box-shadow';
    if (key === 'textAlign') return 'text-align';
    if (key === 'fontFamily') return 'font-family';
    if (key === 'backgroundColor') return 'background-color';
    if (key === 'backgroundImage') return 'background-image';
    if (key === 'backgroundRepeat') return 'background-repeat';
    if (key === 'backdropFilter') return 'backdrop-filter';
    if (key === 'fontSize') return 'font-size';
    if (key === 'lineHeight') return 'line-height';
    if (key === 'borderRadius') return 'border-radius';
    if (key === 'backgroundSize') return 'background-size';
    if (key === 'minHeight') return 'min-height';
    return key;
})
return updatedCSS;
}



const getCardHTML = (currentCard, gridEnabled, index) => {
    const {front, name, backEnabled, back, flipDirection} = currentCard
    let frontCSS = newToCss(front);
    let backCSS = newToCss(back);
    let cleanName = getCleanName(name) + "-" + index;
    let wrapperName = !backEnabled ? `${cleanName}-wrapper` : `${cleanName}-wrapper flip-wrapper`;
    let cardName = !backEnabled ? `${cleanName}` : `${cleanName} inner`;
    let backName = flipDirection === "false" ? "back-h" : "back"
    let innerName = flipDirection === "false" ? "inner-h" : "inner"
    let htmlContent = !backEnabled ? createHTMLString(frontCSS, frontCSS) : 
    ` <div class="front"> ${createHTMLString(frontCSS, frontCSS)} </div> ` +
              `<div class="${backName}"> ${createHTMLString(backCSS, frontCSS)} </div>`;
    return !backEnabled ? `<div style="display: inline-block; margin: 10px;"><div class="${cardName}">  ${htmlContent}</div></div> ` :
                        `<div style="display: inline-block; margin: 10px;"><div class="flip-wrapper"><div class="${cleanName} ${innerName}">  ${htmlContent}</div></div></div> `;
}


const getGridHTML = (currentCard, gridEnabled, index) => {
    const {front, name, backEnabled, back, flipDirection} = currentCard
    let frontCSS = newToCss(front);
    let backCSS = newToCss(back);
    let cleanName = getCleanName(name) + "-" + index;
    let wrapperName = !backEnabled ? `${cleanName}-wrapper` : `${cleanName}-wrapper flip-wrapper`;
    let backName = flipDirection === "false" ? "back-h" : "back"
    let innerName = flipDirection === "false" ? "inner-h" : "inner"
    let cardName = !backEnabled ? `${cleanName}` : `${cleanName} ${innerName}`;
    let htmlContent = !backEnabled ? createHTMLString(frontCSS, frontCSS) : 
    ` <div class="front"> ${createHTMLString(frontCSS, frontCSS)} </div> ` +
              `<div class="${backName}"> ${createHTMLString(backCSS, frontCSS)} </div>`;
    return !backEnabled ? `<div class="${cleanName}-wrapper"><div class="${cardName}">  ${htmlContent}</div></div> ` :
                        `<div class="${cleanName}-wrapper flip-wrapper"><div class="${cleanName} ${innerName}">  ${htmlContent}</div></div> `;
}
const getCardCSS = (currentCard, editorState, index) => {
    const {front, body, back, name, backEnabled} = currentCard
    let frontCSS = newToCss(front);
    let bodyCss = newToCss(body);
    let contentCSS = currentCard.backEnabled ? 
            convertToString(true, backEnabled, frontCSS, currentCard, name, index, true).css + convertToString(false, backEnabled, newToCss(back), currentCard, name, index, true).css :
            convertToString(true, backEnabled, frontCSS, currentCard, name, index, true).css
    return {
        body: convertBodyToString(true, bodyCss, name, index, true, currentCard.backEnabled).css,
        content: contentCSS,
        wrapper: ''
    }
}

const getGridCardCSS = (currentCard, editorState, index, gridOption, responsive) => {
    const {front, body, back, name, backEnabled} = currentCard
    let frontCSS = newToCss(front);
    let width = body.width
    let height = body.height
    if(!responsive && gridOption.width )
        width = gridOption.width;
    if(!responsive && gridOption.height)
        height = gridOption.height;
    if(responsive)
        width = "100%"
    let bodyCss = newToCss({...body, width, height});
    let contentCSS = currentCard.backEnabled ? 
            convertToString(true, backEnabled, frontCSS, currentCard, name, index, true).css + convertToString(false, backEnabled, newToCss(back), currentCard, name, index, true).css :
            convertToString(true, backEnabled, frontCSS, currentCard, name, index, true).css
    return {
        body: convertBodyToString(true, bodyCss, name, index, true, currentCard.backEnabled).css,
        content: contentCSS,
        wrapper: convertWrapperToString(name, index, gridOption, responsive).css
    }
}
const generateRegularCard = (editorState) => {
    const {container, cards, gridEnabled} = editorState
    let combinedHTML = "", bodyCSS = "", contentCSS = "", wrapperCSS = "", js = `function flipCard(name) { $(name).toggleClass("flipped"); }`;
    let containerCss = newToCss(container);
    let singleBackEnabled = false;
    cards.forEach((card, index) => {
        combinedHTML += getCardHTML(card, gridEnabled, index);
        let CSS = getCardCSS(card, editorState, index);
        js += generateJS(card, index);
        bodyCSS += CSS.body;
        contentCSS += CSS.content;
        wrapperCSS += CSS.wrapper;
        if(card.backEnabled)
            singleBackEnabled = true;
    });
    let extras = singleBackEnabled ? ".flip-wrapper {  display:inline-block;margin:10px;perspective:1000px;} .inner, .inner-h {position:relative;transition: transform 1s;transform-style: preserve-3d;}.front, .back, .back-h {position:absolute;width:100%;height:100%;backface-visibility: hidden} .back {transform: rotateX(180deg);}.back-h {transform: rotateY(180deg);} .inner.flipped { transform: rotateX(180deg);}.inner-h.flipped { transform: rotateY(180deg);}" : "";
    return {
        html: `<div class="container">${combinedHTML}</div>`,
        css: {
            container : convertContainerToString(containerCss).css,
            body: bodyCSS,
            content: contentCSS,
            wrapper: wrapperCSS,
            extras
        },
        js
    }
}

const generateFlippableCard = (editorState) => {
    const {front, back, body, name, backEnabled, flipDirection} = editorState
    let rotate = flipDirection === "false" ? "Y" : "X"
    let frontCSS = newToCss(front);
    let backCSS = newToCss(back);
    let bodyCss = newToCss(body);
    let extras = `.flip-wrapper {  display:block;perspective:5000px;} .inner {position:relative;transition: transform 1s;transform-style: preserve-3d;}.front, .back {position:absolute;width:100%;height:100%;backface-visibility: hidden} .back {transform: rotate${rotate}(180deg);} .inner.flipped { transform: rotate${rotate}(180deg);}`;
    return {
        html: `<div class="flip-wrapper"><div class="card inner"> <div class="front"> ${createHTMLString(frontCSS, frontCSS)} </div> ` +
              `<div class="back"> ${createHTMLString(backCSS, frontCSS)} </div></div> </div>`,
        css: {
            body: convertBodyToString(true, bodyCss, "card", 0, false, true).css,
            content: [
                convertToString(true, backEnabled, frontCSS, editorState, "card", 0, false),
                convertToString(false, backEnabled, backCSS, editorState, "card", 0, false)
            ],
            extras
        },
        js: `function flipCard(name) { $(name).toggleClass("flipped"); }` + generateSingleJS(editorState)
    }
}

const generateSingleCard = (editorState) => {
    const {front, back, body, name} = editorState
    let frontCSS = newToCss(front);
    let bodyCss = newToCss(body);
    return {
        html: `<div class="card"> ${createHTMLString(frontCSS, frontCSS)} </div> `,
        css: {
            body: convertBodyToString(true, bodyCss, "card", 0, false, false).css,
            content: [
                convertToString(true, false, frontCSS, editorState, "card", 0, false),
                ""
            ],
            extras:''
        },
        js: ''
    }
}

const generateGrid = (config, grid, cards, container) => {
    let responsive = config.responsive;
    if(!grid)
    return {
        html: ``,
        css: {
            container : '',
            body: '',
            content: '',
            wrapper: '',
            extras
        },
        js: ''
    }
    let combinedHTML = "", bodyCSS = "", contentCSS = "", wrapperCSS = "",
    js = `function flipCard(name) { $(name).toggleClass("flipped"); }`;
    let containerCss = newToCss(container);
    let singleBackEnabled = false;
    if(!responsive)
        grid.forEach((gridItem, index) => {
            let card = cards[gridItem.id];
            if(card) {
                combinedHTML += getGridHTML(card, true, index)
                let CSS = getGridCardCSS(card, "", index, gridItem, responsive);
                js += generateJS(card, index);
                bodyCSS += CSS.body;
                contentCSS += CSS.content;
                wrapperCSS += CSS.wrapper;
                if(card.backEnabled)
                    singleBackEnabled = true;
            }
        });
    else {
        cards.forEach((card, index) => {
            if(card) {
                combinedHTML += getGridHTML(card, true, index)
                let CSS = getGridCardCSS(card, "", index, null, responsive);
                js += generateJS(card, index);
                bodyCSS += CSS.body;
                contentCSS += CSS.content;
                wrapperCSS += CSS.wrapper;
                if(card.backEnabled)
                    singleBackEnabled = true;
            }
        });
    }

    let extras = singleBackEnabled ? ".flip-wrapper {  display:inline-block;perspective:1000px;} .inner, .inner-h {position:relative;transition: transform 1s;transform-style: preserve-3d;}.front, .back, .back-h {position:absolute;width:100%;height:100%;backface-visibility: hidden} .back {transform: rotateX(180deg);}.back-h {transform: rotateY(180deg);} .inner.flipped { transform: rotateX(180deg);}.inner-h.flipped { transform: rotateY(180deg);}" : "";
    let col_spacing = config.col_spacing || "15px";
    let row_spacing = config.row_spacing || "15px";
    let min_width = config.min_width || "300px";
    if(responsive)
    extras += `.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(${min_width}, 1fr)); grid-column-gap: ${col_spacing}; grid-row-gap: ${row_spacing}; }`
    else extras += `.cards { display: grid; grid-template-columns: repeat(12, [col] 1fr); grid-template-rows: repeat(5, [row] auto); grid-column-gap: ${col_spacing}; grid-row-gap: ${row_spacing}; }`
    return {
        html: `<div class="container"><div class="cards">${combinedHTML}</div></div>`,
        css: {
            container : convertContainerToString(containerCss).css,
            body: bodyCSS,
            content: contentCSS,
            wrapper: wrapperCSS,
            extras
        },
        js
    }
}

const generateStack = (editorState) => {
    const {container, cards, gridEnabled} = editorState
    if(!cards)
    return {
        html: ``,
        css: {
            container : '',
            body: '',
            content: '',
            wrapper: '',
            extras
        },
        js: ''
    }
    let combinedHTML = "", bodyCSS = "", contentCSS = "", wrapperCSS = "",
     js = `function flipCard(name) { $(name).toggleClass("flipped"); }` + 
     "var currentCard =  "+ (cards.length-1) + ""+
     "var cardAmount = "+ (cards.length-1)+ ""+
     "function reset() {" +
       "for(i = 0; i <=  "+ (cards.length-1)+ "-2; i++) {"+
         "$('.id-' + (i)).css('left', '25px');"+
         "$('.id-' + (i)).css('top', '0px');"+
         "$('.id-' + (i)).css('display', 'block');"+
         "$('.card-' + (i)).removeClass('flipped');"+
       "}"+
       "$('.id-' + (cardAmount)).css('left', '45px');"+
       "$('.id-' + (cardAmount)).css('top', '10px');"+
       "$('.id-' + (cardAmount)).css('display', 'block');"+
       "$('.id-' + (cardAmount - 1)).css('left', '35px');"+
       "$('.id-' + (cardAmount - 1)).css('top', '5px');"+
       "$('.id-' + (cardAmount - 1)).css('display', 'block');"+
       "currentCard = "+ (cards.length-1) + ";"+
     "}"+
     "function nextCard() {"+
       "$('.id-' + (currentCard - 1)).css('left', '45px');"+
       "$('.id-' + (currentCard-1)).animate({top: '10px'});"+
       "$('.id-' + (currentCard - 2)).css('left', '35px');"+
       "$('.id-' + (currentCard-2)).animate({top: '5px'});"+
       "$('.id-' + (currentCard)).animate({top: '-250px'});"+
       "$('.id-' + (currentCard)).fadeOut(300);"+
       "setTimeout(_=> {"+
         "$('.id-' + (currentCard+1)).hide();"+
       "}, 300);"+
       "currentCard--;"+
     "}"
    let containerCss = newToCss(container);
    let singleBackEnabled = false;
    cards.forEach((card, index) => {
        let left = index < cards.length-3 ? "25px" : (25 + Math.abs(((cards.length-index - 3) * 10) ) + "px")
        let top = index < cards.length-3 ? "0px" : (Math.abs(((cards.length-index - 3) * 5) ) + "px")
        combinedHTML += "<div style='top:"+top+";left:"+left+";' class='stack-card id-"+ index +"'>" + getCardHTML(card, gridEnabled, index) + "</div>"
        let CSS = getCardCSS(card, editorState, index);
        js += generateJS(card, index);
        bodyCSS += CSS.body;
        contentCSS += CSS.content;
        wrapperCSS += CSS.wrapper;
        if(card.backEnabled)
            singleBackEnabled = true;
    });
    let extras = singleBackEnabled ? ".flip-wrapper {  display:inline-block;perspective:1000px;} .inner, .inner-h {position:relative;transition: transform 1s;transform-style: preserve-3d;}.front, .back, .back-h {position:absolute;width:100%;height:100%;backface-visibility: hidden} .back {transform: rotateX(180deg);}.back-h {transform: rotateY(180deg);} .inner.flipped { transform: rotateX(180deg);}.inner-h.flipped { transform: rotateY(180deg);}" : "";
    extras += ".stack {position: relative;list-style-type: none;top:15px}.stack-card {position: absolute;} .stack-wrapper {text-align: center;position: relative;display: inline-table;}"
    return {
        html: `<div class="stack-wrapper"><ul class="stack">${combinedHTML}</ul></div><button style="margin-left: 40px;" class="stack-btn" onclick="nextCard()"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-forward-fill" viewBox="0 0 16 16"><path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z"/></svg></button><button style="margin-left: 5px;" class="stack-btn" onclick="reset()"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg></button></div>`,
        css: {
            container : convertContainerToString(containerCss).css,
            body: bodyCSS,
            content: contentCSS,
            wrapper: wrapperCSS,
            extras
        },
        js
    }
}

export {
    generateFlippableCard,
    generateRegularCard,
    generateJS,
    generateSingleCard,
    generateStack,
    generateGrid
}