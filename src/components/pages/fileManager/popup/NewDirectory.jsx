import React from 'react';
import { dispatch } from '../../../../core/helpers/EventEmitter';

export default class extends React.Component {

  render() {
    return (
      <div>
        <div class="modal-body">
          <div class="form-group">
            <label for="inputDirectoryName">Input directory name</label>
            <input
              type="text"
              id="inputDirectoryName"
              class="form-control"
              placeholder="Directory name"
              autoFocus
              ref={(node) => this.directoryName = node}
              onKeyDown={(e) => {
                if (e.which === 13) {
                  return this.props.onCreateDirectoryClick();
                }
              }}
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-default"
            onClick={() => dispatch('popup:close')}>Cancel</button>
          <button
            type="button"
            class="btn btn-primary pull-right"
            onClick={this.props.onCreateDirectoryClick}>Create</button>
        </div>
      </div>
    );
  }
}
