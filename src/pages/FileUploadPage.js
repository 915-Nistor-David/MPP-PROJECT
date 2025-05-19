// src/pages/FileUploadPage.js

import React, { useState } from 'react';
import './FileUploadPage.css'; // optional styling

export default function FileUploadPage() {
  const [file, setFile]         = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [error, setError]       = useState('');

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setUploadUrl('');
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = await res.json();
      setUploadUrl(data.url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload a Large File (e.g. Video)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>

      {error && <p className="error">{error}</p>}

      {uploadUrl && (
        <div className="uploaded">
          <p>Upload successful! Download link:</p>
          <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
            {uploadUrl}
          </a>
        </div>
      )}
    </div>
  );
}
