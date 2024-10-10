import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/CommentSection.scss';

const CommentSection = ({ updateId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Manage which comment is being replied to
  const [expandedComments, setExpandedComments] = useState(null); // Manage expanded replies
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    fetchComments();
  }, [updateId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/comments/update/${updateId}`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleSubmitComment = async (e, parentCommentId = null) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          updateId,
          content: newComment,
          parentCommentId
        })
      });
      const data = await response.json();
      if (parentCommentId) {
        setComments(comments.map(comment =>
          comment._id === parentCommentId
            ? { ...comment, replies: [...comment.replies, data] }
            : comment
        ));
      } else {
        setComments([data, ...comments]);
      }
      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null); // Collapse the input field
    setNewComment('');   // Clear the input field
  };

  const toggleReplies = (commentId) => {
    setExpandedComments(expandedComments === commentId ? null : commentId); // Toggle expanded replies
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const differenceInMilliseconds = now - createdAt;

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInHours < 24) {
      if (differenceInMinutes < 60) {
        return differenceInMinutes === 1 ? "1 minute ago" : `${differenceInMinutes} minutes ago`;
      } else {
        return differenceInHours === 1 ? "1 hour ago" : `${differenceInHours} hours ago`;
      }
    } else {
      return differenceInDays === 1 ? "1 day ago" : `${differenceInDays} days ago`;
    }
  };

  return (
    <>
      <h3 style={{ marginLeft: '30px', marginTop: '30px' }}>Comments</h3>

      <div className="comment-sect">
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment" style={{ backgroundColor: '#fff' }}>
              <div className="comment-header">
                <img src='../assets/user.png' alt="User avatar" />
                <span className="comment-author">{`${comment.user.firstName} ${comment.user.lastName}`}</span>
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>

              {/* Change the Reply button to Cancel when replying */}
              <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>
                {replyingTo === comment._id ? 'Cancel' : 'Reply'}
              </button>

              {replyingTo === comment._id && (
                <form onSubmit={(e) => handleSubmitComment(e, comment._id)}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <div className="reply-actions">
                    <button type="submit">Post Reply</button>
                  </div>
                </form>
              )}

              {comment.replies.length > 0 && (
                <div className="replies">
                  <div className="more" style={{display: 'flex', flexDirection: 'row', cursor: "pointer"}} >
                    <div className="morehr" style={{width: '10%', height: '25px', padding: '10px'}}>
                      <hr />
                    </div>
                    <div className="more2">
                      <a onClick={() => toggleReplies(comment._id)} >
                        {expandedComments === comment._id ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
                      </a>
                    </div>
                    <div className="morehr" style={{width: '10%', height: '25px', padding: '10px'}}>
                      <hr />
                    </div>
                  </div>


                  {expandedComments === comment._id && comment.replies.map((reply) => (
                    <div key={reply._id} className="reply" style={{ backgroundColor: '#fff', marginTop: "15px" }}>
                      <div className="comment-header">
                        <img src='../assets/user.png' alt="User avatar" />
                        <span className="comment-author">{`${reply.user.firstName} ${reply.user.lastName}`}</span>
                        <span className="comment-time">{timeAgo(reply.createdAt)}</span>
                      </div>
                      <p className="comment-content">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => handleSubmitComment(e)}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment and start a thread..."
        />
        <button type="submit">Post Comment</button>
      </form>
    </>
  );
};

export default CommentSection;