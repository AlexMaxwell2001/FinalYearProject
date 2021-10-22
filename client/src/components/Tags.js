import React, { useState } from "react"
export function TagSelector(props) {
  const [tagInput, setTagInput] = useState("");
  let { tags, setTags } = props;
  const addTag = tag => {
    if (tags.indexOf(tag) === -1) // if does not already exist
      setTags([...tags, tag]); // add to external tag list
  }
  const onSubmit = e => {
    e.preventDefault();
    addTag(tagInput);
    setTagInput("");
  }
  return <React.Fragment>
    <h5>Tags</h5>
    <p>Help others find your cards! Enter your tag name in the input box below, and press enter your keyboard.</p>
    <form onSubmit={onSubmit}>
      <input value={tagInput} onChange={e => setTagInput(e.target.value)} className="bordered" placeholder="Enter Tag Here" type="text" />
    </form>
  </React.Fragment>
}

export function TagDisplay(props) {
  let { tags, setTags, deleteable } = props;
  const removeTag = tag => {
    setTags(tags.filter(value => value !== tag)); // remove element from external tag list
  }
  if (!tags.length)
    return null;
  return <div className="chips" style={{ border: "none" }}>
    {tags.map((value, index) => {
      return <div key={index} className="chip">
        <div className="chip-content-container">
          <span className="chip-text">{value}</span>
          {deleteable && <i onClick={_ => removeTag(value)} className="material-icons">close</i>}
        </div>
      </div>
    })}
  </div>
}