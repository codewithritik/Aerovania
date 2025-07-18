import React from 'react';

const FileUploader = ({ onFileSelect }) => (
  <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
    <input
      type="file"
      accept="application/json"
      className="hidden"
      id="file-upload"
      onChange={e => onFileSelect(e.target.files[0])}
    />
    <label htmlFor="file-upload" className="cursor-pointer">
      <div className="text-blue-600 font-semibold">Drag & Drop or Click to Upload JSON</div>
    </label>
  </div>
);

export default FileUploader; 