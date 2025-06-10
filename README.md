# Request Tracker Dashboard

A React-based dashboard that allows stakeholders to view and interact with Azure DevOps work items submitted through a Microsoft Form, with filtering, tracking, and commenting features.

## 🚀 Features

- 📋 Displays requests created from an MS Form and stored in Azure DevOps
- 🎯 Filters by requestor, assignee, and keyword (title or work item ID)
- 🔄 Comments system with real-time updates and author attribution
- 🔍 Highlights changes to priority between requestor and team adjustments
- 🧭 Status tracker showing request progress through custom stages
- 💬 Toggleable request details and discussion threads
- ✅ Hide/show closed work items with resizable table view
- 💡 Maintains filter state across sessions via `localStorage`

---

## 🗂 Project Structure

- `App.js`: Main logic, request fetching, transformation, and routing:contentReference[oaicite:0]{index=0}
- `StatusTracker.js`: Visual status display and comment section:contentReference[oaicite:1]{index=1}
- `RequestTable.js`: Filterable and sortable list of requests:contentReference[oaicite:2]{index=2}
- `Navbar.js`: Top-level filters and UI controls:contentReference[oaicite:3]{index=3}
- `azureApi.js`: Azure DevOps API calls using a Personal Access Token:contentReference[oaicite:4]{index=4}
- `statusStages.js`: Definitions of work item state flow:contentReference[oaicite:5]{index=5}

---

## 🛠 Setup

### Prerequisites

- Node.js and npm installed
- An Azure DevOps PAT with read/write access to Work Items
- A shared WIQL query in ADO for form-tagged requests

### Installation

```bash
npm install
