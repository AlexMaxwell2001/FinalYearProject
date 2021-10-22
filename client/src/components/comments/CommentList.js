import React, { Component } from 'react';
import Comment from './Comment';
import style from './style';
import StarRatings from "react-star-ratings";

class CommentList extends Component {
  render() {
    let com;

    let commentNodes = this.props.data.map((comment, index) => {
      if(this.props.usersID === comment.authorId){
        com = <Comment author={ comment.author } uniqueID={ comment['_id'] } cardId={ comment.cardId } authorId={ comment.authorId } usersID={ this.props.usersID } onCommentDelete={ this.props.onCommentDelete } onCommentUpdate={ this.props.onCommentUpdate } key={ comment.id }>{ comment.text }</Comment>
      } else {
        com = <Comment author={ comment.author } uniqueID={ comment['_id'] } cardId={ comment.cardId } authorId={ comment.authorId } key={ comment.id }>{ comment.text }</Comment>
      }

      return (
        <React.Fragment key={index}>
        <StarRatings
          rating={ comment.rating }
          starRatedColor={'rgb(255, 206, 0)'}
          starHoverColor={'rgb(255, 167, 0)'}
          isAggregateRating={false}
          numOfStars={5}
        />
        {com}
        </React.Fragment>
      )
    })

    return (
      <div style={ style.commentList }>
        { commentNodes }
      </div>
    )
  }
}

export default CommentList;