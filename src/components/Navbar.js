import React from 'react';
import './Navbar.css';

function Navbar({
  requestor,
  setRequestor,
  assignee,
  setAssignee,
  searchTerm,
  setSearchTerm,
  nameOptions = [],
  assigneeOptions = [],
  onClearFilters
}) {

  return (
    <nav className="navbar-modern">
      <div className="navbar-logo">
        <span>📦</span> Request Tracker
      </div>
      <div className="navbar-filters">
        <select value={requestor} onChange={e => setRequestor(e.target.value)}>
          <option value="">Filter by Requestor</option>
          {nameOptions.map(opt => (
            <option key={opt.raw} value={opt.raw}>{opt.label}</option>
          ))}
        </select>

        <select value={assignee} onChange={e => setAssignee(e.target.value)}>
          <option value="">Filter by Assignee</option>
          {assigneeOptions.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button onClick={onClearFilters} className="clear-button">
          Clear Filters
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
