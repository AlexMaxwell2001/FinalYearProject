import React from 'react'
import {Collapsible, CollapsibleItem, NavItem} from 'react-materialize'

const FAQS = [
    {
        Q: "What is cards without code?",
        A: "Cards without code is a tool designed to create user interface cards without writing HTML/CSS/Javascript."
    },
    {
        Q: "What can I do with cards without code?",
        A: "With Cards without code, you can create user interface cards and export them to your site, saving you the hassle of coding it manually and focusing on design rather than principle."
    },
    {
        Q: "Are my cards visible to others?",
        A: "Your cards are only visible to others if you add them to a public Set. Sets can be made public through the 'settings' option in the editor."
    },
    {
        Q: "I've just created a card. How do I export it?",
        A: "Once you create a card and are ready to export, navigate to the card editor if not already there and select 'View Code'. Copy this code to your website!"
    },
    {
        Q: "What is a card?",
        A: "A card is a user interface design pattern that visually resembles a playing card that groups related information in a flexible-size container."
    },
    {
        Q: "What is a card set?",
        A: "A card set is a way of grouping pre-made cards into one area. They can either be exported as-is or included in an arrangement."
    },
    {
        Q: "What is an arrangement?",
        A: "An arrangement is a way to organize your card sets in various forms. For example, I could arrange my cards in a flexible grid."
    }
]
export default function FAQ() {
    return <div style={{display:"flex"}}>
        <div style={{width:300, backgroundColor:"white", height:"100vh"}}>
            <h5>User Manual</h5>
            <hr></hr>
            <NavItem href="">
               FREQUENTLY ASKED QUESTIONS
                </NavItem>
            <Collapsible accordion={false}>
  <CollapsibleItem
    expanded={false}
    header="Tutorials"
    node="div"
  >
    <NavItem href="">
    Getting started
    </NavItem>
  </CollapsibleItem>
  <CollapsibleItem
    expanded={false}
    header="Elements"
    node="div"
  >
    <NavItem href="">
    Getting started
    </NavItem>
  </CollapsibleItem>
</Collapsible>
        </div>
    <div style={{padding:50, width:"100%"}}>
        <h4>FREQUENTLY ASKED QUESTIONS (FAQ'S)</h4>
        <Collapsible accordion>
            {FAQS.map((value, index) => {
                return <CollapsibleItem key={index} header={
                        <div className="full-width">
                            <b>{value.Q}</b>
                            <i className="material-icons right">keyboard_arrow_down</i>
                         </div>
                    }>
                    {value.A}
                </CollapsibleItem>
            })}
        </Collapsible>
    </div>
    </div>
}