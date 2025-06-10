import { STATUS_STAGES } from '../constants/statusStages';
import './StatusTracker.css';
import { useState, useEffect } from 'react';
import { postComment, getComments } from '../api/azureApi';

function StatusTracker({
  state,
  title,
  assignee,
  id,
  latestComment,
  allComments,
  urgency,
  description,
  requestor,
  requestedPriority,
  priorityChanged
}) {

  const [expanded, setExpanded] = useState(false);
  const currentIndex = STATUS_STAGES.findIndex(stage => stage.key === state);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  

  useEffect(() => {
      setComments([]);
    }, [id]);


  // 🔍 Load comments once when expanded
  useEffect(() => {
    if (!expanded || comments.length > 0) return;

    async function fetchComments() {
      try {
        const updated = await getComments(id);
        const cleanComments = updated.map(({ text, author, date }) => {
          const div = document.createElement('div');
          div.innerHTML = text;
          const cleanText = div.textContent || div.innerText || '';
          return { author, date, text: cleanText };
        });

        console.log('Loaded comments:', cleanComments); // ✅ DEBUG LOG

        setComments(cleanComments);
      } catch (err) {
        console.error('Failed to fetch comments:', err); // ✅ DEBUG LOG
      }
    }

    fetchComments();
  }, [expanded, id, comments.length]);

  return (
    <div className="tracker-wrapper">
      <div className="tracker-header">
        <h3>{title}</h3>
        <div className="workitem-id">Work Item ID: {id}</div>
      </div>

      <div className="progress-tracker">
        {STATUS_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={stage.key} className="step-wrapper">
              <div className={`step-circle ${isCompleted ? 'completed' : isCurrent ? 'current' : ''}`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              {index < STATUS_STAGES.length - 1 && (
                <div className={`step-line ${index < currentIndex ? 'filled' : ''}`} />
              )}
              <div className="step-label">{stage.label}</div>
            </div>
          );
        })}
      </div>
        <p><strong>Assigned to:</strong> {assignee || 'Unassigned'}</p>
        <p>
          <strong>Priority:</strong> {urgency}
          {priorityChanged && requestedPriority && (
            <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '8px' }}>
              (Updated from: {requestedPriority})
            </span>
          )}
        </p>



        <p><strong>Status:</strong> {STATUS_STAGES[currentIndex]?.description || state}</p>

      <div className="comments-section"><div className="tracker-controls">
        <button onClick={() => setShowDetails(prev => !prev)} className="toggle-details-btn">
          {showDetails ? '▲ Hide Request Details' : '▼ Show Request Details'}
        </button>
        <button onClick={() => setExpanded(prev => !prev)} className="toggle-details-btn">
          {expanded ? '▲ Hide Updates' : '▼ Show Updates'}
        </button>
      </div>
      {showDetails && description && (
  <div
    className="description-box"
    style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '6px' }}
    dangerouslySetInnerHTML={{ __html: description }}
  />
)}



        {expanded && (
          <>
            {comments.length > 0 ? (
              <ul className="comment-list">
                {comments.map((comment, index) => (
                  <li key={index}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                      {comment.author}{' '}
                      <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#666' }}>
                        {comment.date ? new Date(comment.date).toLocaleString() : ''}
                      </span>
                    </div>
                    <div>{comment.text}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: 'italic', marginTop: '1em' }}>No comments yet.</p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;

                setPosting(true);
                const dashboardMessage = `_Submitted from Dashboard:_\n${commentText}`;

                try {
                  await postComment(id, dashboardMessage);

                  const updated = await getComments(id);
                  const cleanComments = updated.map(({ text, author, date }) => {
                    const div = document.createElement('div');
                    div.innerHTML = text;
                    const cleanText = div.textContent || div.innerText || '';
                    return { author, date, text: cleanText };
                  });

                  setComments(cleanComments);
                  setCommentText('');
                } catch (err) {
                  alert('Failed to post comment');
                } finally {
                  setPosting(false);
                }
              }}
            >
              <textarea
                id='commentText'
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={3}
                placeholder="Write a comment to post to the ADO board..."
                style={{ width: '100%', marginTop: '10px', padding: '6px', borderRadius: '6px' }}
              />
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className="send-comment-btn"
              >
                {posting ? 'Sending...' : 'Send Comment'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusTracker;
