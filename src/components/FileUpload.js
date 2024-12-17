import React from 'react';
import parseAiken from '../utils/parseAiken';

const FileUpload = ({ onFileLoad }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedQuestions = parseAiken(content);
        onFileLoad(parsedQuestions);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        className="btn btn-primary btn-lg" // Same styling as "Start Quiz" button
        onClick={() => document.getElementById('fileInput').click()}
      >
        Open File
      </button>
    </div>
  );
};

export default FileUpload;
