import React from 'react';
import TrackerBar from './TrackerBar';

function RequestList({ items }) {
  if (items.length === 0) return <p>No matching requests found.</p>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #ccc', marginBottom: 15, padding: 10, borderRadius: 8 }}>
          <h4>{item.title}</h4>
          <p>Status: <strong>{item.state}</strong></p>
          <TrackerBar state={item.state} />
        </div>
      ))}
    </div>
  );
}

export default RequestList;
