export async function getFormRequests() {
  const queryId = '92d028f4-d9e8-4da0-b203-a8074147600c';
  const ORG = process.env.REACT_APP_AZURE_ORG;
  const PROJECT = process.env.REACT_APP_AZURE_PROJECT_ID;
  const PAT = process.env.REACT_APP_AZURE_PAT;

  const authHeader = {
    Authorization: `Basic ${btoa(`:${PAT}`)}`,
    'Content-Type': 'application/json',
  };

  const wiqlRes = await fetch(
    `https://dev.azure.com/${ORG}/${PROJECT}/_apis/wit/wiql/${queryId}?api-version=7.0`,
    {
      method: 'GET',
      headers: authHeader,
    }
  );

  const wiqlData = await wiqlRes.json();
  const ids = wiqlData.workItems.map(item => item.id).slice(0, 200);

  const batchRes = await fetch(
    `https://dev.azure.com/${ORG}/_apis/wit/workitemsbatch?api-version=7.0`,
    {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        ids,
        fields: [
          'System.Id',
          'System.Title',
          'System.State',
          'System.AssignedTo',
          'System.Tags',
          'System.CreatedDate',
          'Custom.KeyStakeholders',
        ],
      }),
    }
  );

  const result = await batchRes.json();
  return result.value;
}

export async function getLatestComment(workItemId) {
  const ORG = process.env.REACT_APP_AZURE_ORG;
  const PROJECT = process.env.REACT_APP_AZURE_PROJECT_ID;
  const PAT = process.env.REACT_APP_AZURE_PAT;

  const authHeader = {
    Authorization: `Basic ${btoa(`:${PAT}`)}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(
    `https://dev.azure.com/${ORG}/${PROJECT}/_apis/wit/workItems/${workItemId}/comments?top=1&order=desc&api-version=7.0-preview.3`,
    {
      method: 'GET',
      headers: authHeader,
    }
  );

  const data = await res.json();
  return data.comments?.[0]?.text || null;
}
export async function getComments(workItemId) {
  const ORG = process.env.REACT_APP_AZURE_ORG;
  const PROJECT = process.env.REACT_APP_AZURE_PROJECT_ID;
  const PAT = process.env.REACT_APP_AZURE_PAT;

  const authHeader = {
    Authorization: `Basic ${btoa(`:${PAT}`)}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(
    `https://dev.azure.com/${ORG}/${PROJECT}/_apis/wit/workItems/${workItemId}/comments?order=desc&api-version=7.0-preview.3`,
    {
      method: 'GET',
      headers: authHeader,
    }
    
  );

  const data = await res.json();

  return (data.comments || []).map(comment => ({
    text: comment.text,
    author: comment.createdBy?.displayName || 'Unknown',
    date: comment.createdDate || '',
  }));
}


export async function postComment(workItemId, message) {
  const ORG = process.env.REACT_APP_AZURE_ORG;
  const PROJECT = process.env.REACT_APP_AZURE_PROJECT_ID;
  const PAT = process.env.REACT_APP_AZURE_PAT;

  const authHeader = {
    Authorization: `Basic ${btoa(`:${PAT}`)}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(
    `https://dev.azure.com/${ORG}/${PROJECT}/_apis/wit/workItems/${workItemId}/comments?api-version=7.0-preview.3`,
    {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        text: message
      })
    }
  );

  const data = await res.json();
  return data;
}
