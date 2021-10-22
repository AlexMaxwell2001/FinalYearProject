import React, { Component } from 'react';
import style from './style';
import StarRatings from "react-star-ratings";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = { text: '', rating: 0 };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }
  changeRating(rating) {
    this.setState({
      rating: rating
    })
  }
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let text = this.state.text.trim();
    let rating = this.state.rating;

    if (!text || !rating) {
      return;
    }
    this.props.onCommentSubmit({ text: text, rating: rating });
    this.setState({ text: '', rating: 0 });
  }
  render() {
    return (
      <form style={ style.commentForm } onSubmit={ this.handleSubmit }>
        <StarRatings
            rating={this.state.rating}
            isSelectable={true}
            starRatedColor={'rgb(255, 206, 0)'}
            starHoverColor={'rgb(255, 167, 0)'}
            isAggregateRating={false}
            changeRating={this.changeRating}
            numOfStars={5}
        />
        <input
          type='hidden'
          value={ this.state.rating } />
        <input
          type='text'
          placeholder='Say something...'
          style={ style.commentFormText}
          value={ this.state.text }
          onChange={ this.handleTextChange } />
        <input
          type='submit'
          style={ style.commentFormPost }
          value='Post'/>
      </form>
    )
  }
}

export default CommentForm;