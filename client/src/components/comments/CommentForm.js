import React, { Component } from 'react';
import style from './style';
import StarRatings from "react-star-ratings";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', rating: 0, username:JSON.stringify(this.props.userInfo)};
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
    let username = this.state.username
    if (!text || !rating) {
      return;
    }
    this.props.onCommentSubmit({ username:username,text: text, rating: rating });
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
        <button
          disabled={this.state.text === "" || this.state.rating === 0}
          type='submit'
          className='btn btn-primary'
          >POST</button>
      </form>
    )
  }
}

export default CommentForm;