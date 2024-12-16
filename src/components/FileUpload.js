import React from 'react';
import parseAiken from '../utils/parseAiken'; // Import the utility function for parsing

const FileUpload = ({ onFileLoad }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = (e) => {
        const content = e.target.result; // Get the file content
        const parsedQuestions = parseAiken(content); // Parse the content using Aiken format
        onFileLoad(parsedQuestions); // Pass the parsed data to the parent
      };
      reader.readAsText(file); // Read the file content as text
    }
  };

  return (
    <div>
      <label htmlFor="fileInput">
        <input
          type="file"
          id="fileInput"
          accept=".txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button type="button" onClick={() => document.getElementById('fileInput').click()}>Open File</button>
      </label>
    </div>
  );
};

export default FileUpload;
