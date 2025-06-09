import React, { useState } from 'react';
import './RequestTable.css';

function RequestTable({ data, onSelect, selectedId }) {
  const [sortKey, setSortKey] = useState('RequestDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState('');
  const [hideClosed, setHideClosed] = useState(true);

  const PRIORITY_ORDER = [
    'Critical Issue',
    'High Priority Fix',
    'Medium Priority',
    'Low Priority Enhancement'
  ];

  const STATUS_ORDER = [
    'Not Started',
    'Ready for Iteration',
    'In Progress',
    'Ready for Review',
    'Done',
    'Closed',
    'Removed'
  ];

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const filtered = data
    .filter(item => (filterUrgency ? item.Urgency === filterUrgency : true))
    .filter(item => (hideClosed ? item.WorkItemState !== 'Closed' : true))
    .sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'RequestDate') {
        return sortAsc
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      if (sortKey === 'Urgency') {
        const aIdx = PRIORITY_ORDER.indexOf(aVal);
        const bIdx = PRIORITY_ORDER.indexOf(bVal);
        return sortAsc ? aIdx - bIdx : bIdx - aIdx;
      }

      if (sortKey === 'WorkItemState') {
        const aIdx = STATUS_ORDER.indexOf(aVal);
        const bIdx = STATUS_ORDER.indexOf(bVal);
        return sortAsc ? aIdx - bIdx : bIdx - aIdx;
      }

      // Default: alphabetical
      aVal = aVal?.toString().toLowerCase() || '';
      bVal = bVal?.toString().toLowerCase() || '';
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });


  const urgencyOptions = Array.from(new Set(data.map(d => d.Urgency))).filter(Boolean);

  return (
    <div className="table-wrapper">
      <div className="table-controls">
        <label>
          Filter by Urgency:{' '}
          <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}>
            <option value="">All</option>
            {urgencyOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={hideClosed}
            onChange={() => setHideClosed(prev => !prev)}
            style={{ marginRight: '5px' }}
          />
          Hide Closed
        </label>
      </div>
      {hideClosed && (
        <p style={{ fontStyle: 'italic', color: '#777' }}>
          Closed items are currently hidden.
        </p>
      )}
      <div className="request-table-scroll-container">
        <table className="request-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('Title')}>Title {sortKey === 'Title' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => toggleSort('WorkItemState')}>Status {sortKey === 'WorkItemState' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => toggleSort('Assignee')}>Assignee {sortKey === 'Assignee' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => toggleSort('Urgency')}>Urgency {sortKey === 'Urgency' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('RequestDate')}>Requested Date {sortKey === 'RequestDate' ? (sortAsc ? '↑' : '↓') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const isSelected = item.WorkItemID === selectedId;
              return (
                <tr
                  key={i}
                  onClick={() => onSelect(item)}
                  className={isSelected ? 'selected-row' : ''}
                >
                  <td>{item.Title}</td>
                  <td>{item.WorkItemState}</td>
                  <td>{item.Assignee}</td>
                  <td>{item.Urgency}</td>
                  <td>{formatDate(item.RequestDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestTable;
