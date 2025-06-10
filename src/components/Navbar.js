import React, { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-modern">
      <div className="navbar-header">
        <div className="navbar-logo">
          <img
            src="./logo512.png"
            alt="App Logo"
            style={{ height: 28, verticalAlign: 'middle', marginRight: 8 }}
          />
          <span>Request Tracker</span>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <div className={`navbar-filters ${menuOpen ? 'open' : ''}`}>
        <select value={requestor} onChange={e => setRequestor(e.target.value)}>
          <option value="">Filter by Requestor</option>
          {nameOptions.map(opt => (
            <option key={opt.raw} value={opt.raw}>
              {opt.label}
            </option>
          ))}
        </select>

        <select value={assignee} onChange={e => setAssignee(e.target.value)}>
          <option value="">Filter by Assignee</option>
          {assigneeOptions.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button className="clear-button" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
