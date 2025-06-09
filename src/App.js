import { useEffect, useState } from 'react';
import { getFormRequests } from './api/azureApi';
import StatusTracker from './components/StatusTracker';
import Navbar from './components/Navbar';
import RequestTable from './components/RequestTable';
import { getLatestComment, getComments } from './api/azureApi';

function App() {
  const [results, setResults] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [allRequests, setAllRequests] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [requestorFilter, setRequestorFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [nameOptions, setNameOptions] = useState([]);


  // Fetch ADO data once on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const rawItems = await getFormRequests();

        const transformed = rawItems.map(item => {
          const tags = item.fields['System.Tags'] || '';
          const urgency = extractUrgency(tags);

          return {
            Title: item.fields['System.Title'],
            Assignee: item.fields['System.AssignedTo']?.displayName || 'Unassigned',
            WorkItemState: item.fields['System.State'],
            RequestDate: item.fields['System.CreatedDate'] || new Date().toISOString(),
            WorkItemID: item.id,
            KeyStakeholders: item.fields['Custom.KeyStakeholders'] || '',
            Description: item.fields['System.Description'] || '',
            Tags: tags,
            Urgency: urgency
          };
          

        });

        setAllRequests(transformed);
        const uniqueRequestors = Array.from(
          new Set(
            transformed.map(req => req.KeyStakeholders?.trim()).filter(Boolean)
          )
        ).map(full => ({
          label: parseRequestorLabel(full),
          raw: full
        }));
        setNameOptions(uniqueRequestors);

      } catch (err) {
        console.error('Failed to fetch ADO data', err);
      }
    }

    fetchData();
  }, []);


  // Filter and sort by user input
  useEffect(() => {
    const match = allRequests.filter(item => {
      const searchMatch =
        searchTerm.trim() &&
        (item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.WorkItemID.toString().includes(searchTerm));

      const assigneeMatch =
        assigneeFilter.trim() &&
        item.Assignee.toLowerCase().includes(assigneeFilter.toLowerCase());

      const requestorMatch =
        requestorFilter.trim() &&
        item.KeyStakeholders.toLowerCase().includes(requestorFilter.toLowerCase());

      // OR logic
      return searchMatch || assigneeMatch || requestorMatch;
    });

    setResults(match.length > 0 ? match : allRequests);
  }, [searchTerm, assigneeFilter, requestorFilter, allRequests]);


  // Auto-select most recent when results change
  useEffect(() => {
    if (results.length > 0) {
      const sorted = [...results].sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate));
      setSelectedRequest(sorted[0]);
    } else {
      setSelectedRequest(null);
    }
  }, [results]);

  useEffect(() => {
    let cancelled = false;

    async function enhanceSelectedRequest() {
      if (selectedRequest && !selectedRequest.LatestComment) {
        const [rawComment, allRawComments] = await Promise.all([
          getLatestComment(selectedRequest.WorkItemID),
          getComments(selectedRequest.WorkItemID),
        ]);

        const cleanComment = stripHtml(rawComment);
        const allClean = allRawComments.map(stripHtml);

        if (!cancelled) {
          setSelectedRequest(prev => ({
            ...prev,
            LatestComment: cleanComment,
            AllComments: allClean,
          }));
        }
      }
    }

    enhanceSelectedRequest();

    return () => {
      cancelled = true;
    };
  }, [selectedRequest]);


  function clearFilters() {
    setSearchTerm('');
    setRequestorFilter('');
    setAssigneeFilter('');
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function extractUrgency(tags) {
    const tagList = tags.toLowerCase();
    if (tagList.includes('highest priority')) return 'Critical Issue';
    if (tagList.includes('high priority')) return 'High Priority Fix';
    if (tagList.includes('medium priority')) return 'Medium Priority';
    if (tagList.includes('low priority')) return 'Low Priority Enhancement';
    return 'Unspecified';
  }
  function parseRequestorLabel(fullString) {
    const match = fullString.match(/^(.+?)\s*\[(.+?)\]$/); // namePart [email]
    if (!match) return fullString;

    const namePart = match[1].trim();
    const email = match[2].trim();

    // Flip LastName, FirstName → FirstName LastName
    const nameMatch = namePart.match(/^([^,]+),\s*(.+?)\s*\((.+?)\)$/);
    if (nameMatch) {
      const last = nameMatch[1];
      const first = nameMatch[2];
      const org = nameMatch[3];
      return `${first} ${last} (${org})`;
    }

    return namePart || email;
  }



  return (
    <div>
      <Navbar
        requestor={requestorFilter}
        setRequestor={setRequestorFilter}
        assignee={assigneeFilter}
        setAssignee={setAssigneeFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        nameOptions={nameOptions}
        assigneeOptions={Array.from(new Set(allRequests.map(r => r.Assignee).filter(Boolean)))}
        onClearFilters={clearFilters}
      />



      <div style={{ padding: '0 30px', maxWidth: 1000, margin: 'auto' }}>
        {selectedRequest && (
        <StatusTracker
          title={selectedRequest.Title}
          state={selectedRequest.WorkItemState}
          assignee={selectedRequest.Assignee}
          id={selectedRequest.WorkItemID}
          latestComment={selectedRequest.LatestComment}
          allComments={selectedRequest.AllComments}
          urgency={selectedRequest.Urgency}
          description={selectedRequest.Description}
          requestor={selectedRequest.KeyStakeholders}
        />
        )}

        <h3 style={{ marginBottom: '0.5rem' }}>Matching Requests</h3>
        <button onClick={clearFilters} style={{ marginBottom: '1rem' }}  className="clear-button">
          Clear All Filters
        </button>

        <RequestTable
          data={results}
          onSelect={setSelectedRequest}
          selectedId={selectedRequest?.WorkItemID}
        />
      </div>
    </div>
  );
}

export default App;
