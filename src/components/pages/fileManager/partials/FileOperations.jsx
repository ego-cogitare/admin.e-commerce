import React from 'react';

export default ({ onCreateDirectory, onUploadFiles, onDownloadFiles, onDeleteFiles, selectedFiles }) => (
  <div class="file-operations">
    <div title="Create new folder" class="new-folder" onClick={onCreateDirectory} />
    <div title="Upload files" class="upload" onClick={onUploadFiles} />
    <div title="Download files" class={"download".concat(selectedFiles.length === 0 ? " disabled" : "")} onClick={onDownloadFiles} />
    <div title="Delete files" onClick={onDeleteFiles} class={"delete".concat(selectedFiles.length === 0 ? " disabled" : "")} />
  </div>
);
