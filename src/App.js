// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

// ----- Your Pages -----
import AddLoanPage      from './pages/AddLoanPage';
import ViewLoansPage    from './pages/ViewLoansPage';
import EditLoanPage     from './pages/EditLoanPage';
import FileUploadPage   from './pages/FileUploadPage';  // ← New!

// ----- Configuration -----
const SERVER_URL = 'http://localhost:3001';

// ----- Connectivity Hooks -----
function useBrowserOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return isOnline;
}

function useServerStatus(serverUrl) {
  const [isServerUp, setIsServerUp] = useState(true);
  useEffect(() => {
    const check = async () => {
      if (!navigator.onLine) {
        setIsServerUp(false);
        return;
      }
      try {
        const res = await fetch(`${serverUrl}/health`);
        setIsServerUp(res.ok);
      } catch {
        setIsServerUp(false);
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [serverUrl]);
  return isServerUp;
}

function useAppConnectivity(serverUrl) {
  const isOnline   = useBrowserOnlineStatus();
  const isServerUp = useServerStatus(serverUrl);
  return { isOnline, isServerUp };
}

// ----- Connectivity Banner -----
function ConnectivityBanner({ serverUrl }) {
  const { isOnline, isServerUp } = useAppConnectivity(serverUrl);

  if (!isOnline) {
    return (
      <div style={{ backgroundColor: '#fdd', padding: 10, marginBottom: 10 }}>
        🚫 Network Offline: You are not connected to the internet.
      </div>
    );
  }
  if (!isServerUp) {
    return (
      <div style={{ backgroundColor: '#fde', padding: 10, marginBottom: 10 }}>
        🛑 Server Down: The backend appears unreachable.
      </div>
    );
  }
  return null;
}

// ----- Offline Operation Queue -----
class OperationQueue {
  constructor(key = 'operationQueue') {
    this.key   = key;
    this.queue = JSON.parse(localStorage.getItem(key) || '[]');
  }
  _save() {
    localStorage.setItem(this.key, JSON.stringify(this.queue));
  }
  enqueue(op) {
    this.queue.push(op);
    this._save();
  }
  async process(syncFn) {
    const next = [];
    for (const op of this.queue) {
      try {
        await syncFn(op);
      } catch {
        next.push(op);
      }
    }
    this.queue = next;
    this._save();
  }
}

async function syncOperation({ type, endpoint, data }) {
  const url = SERVER_URL + endpoint;
  const opts = {
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  };
  let res;
  if (type === 'create')  res = await fetch(url, { ...opts, method: 'POST'  });
  if (type === 'update')  res = await fetch(url, { ...opts, method: 'PATCH' });
  if (type === 'delete')  res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Sync failed (${res.status})`);
  return res;
}

// ----- Main App -----
function App() {
  const opQueueRef = useRef(new OperationQueue());
  const { isOnline, isServerUp } = useAppConnectivity(SERVER_URL);

  // when back online & server up, flush the queue
  useEffect(() => {
    if (isOnline && isServerUp) {
      opQueueRef.current.process(syncOperation)
        .catch(console.error);
    }
  }, [isOnline, isServerUp]);

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <ConnectivityBanner serverUrl={SERVER_URL} />

        <nav style={{ marginBottom: 20 }}>
          <Link to="/add-loan"   style={{ marginRight: 16 }}>Add Loan</Link>
          <Link to="/view-loans" style={{ marginRight: 16 }}>View Loans</Link>
          <Link to="/upload"     style={{ marginRight: 16 }}>Upload File</Link>
          <Link to="/">Home</Link>
        </nav>

        <Routes>
          <Route path="/add-loan"   element={<AddLoanPage  opQueue={opQueueRef.current} />} />
          <Route path="/view-loans" element={<ViewLoansPage />} />
          <Route path="/edit-loan/:id" element={<EditLoanPage />} />
          <Route path="/upload"     element={<FileUploadPage />} />
          <Route path="/"            element={<h1>Home Page</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
