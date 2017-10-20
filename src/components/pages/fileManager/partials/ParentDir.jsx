import React from 'react';

export default ({ path, onDirectoryUp }) =>  (
  <div class={"parent-dir".concat(path === '' ? " disabled" : "")} onClick={() => {
    if (path === '') {
      return false;
    }
    onDirectoryUp(path.substr(0, path.lastIndexOf("/")) || '/');
  }} />
);
