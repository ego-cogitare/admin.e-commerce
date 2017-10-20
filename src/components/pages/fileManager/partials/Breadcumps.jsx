import React from 'react';

const Breadcump = ({ path, cump, pathSelect }) => (
  <div class="breadcump" onClick={() => pathSelect(path)}>
    <span class="dir-name">{cump}</span>
  </div>
);

export default function({ path, onPathChange }) {
  let p = '';
  return (
    <div class="breadcumps">
      {path.split('/').map((subPath, key) => {
        p += subPath + '/';
        return (
          <Breadcump
            key={key}
            pathSelect={onPathChange}
            cump={key === 0 ? '' : subPath}
            path={p.replace(/\/$/, '') || "/"}
          />
        );
      })}
    </div>
  );
}
