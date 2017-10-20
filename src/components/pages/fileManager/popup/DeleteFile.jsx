import React from 'react';
import { dispatch } from '../../../../core/helpers/EventEmitter';

export default ({ onDeleteClick }) => (
  <div>
    <div class="modal-body">
      Are you sure you want to delete selected files?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Cancel</button>
      <button type="button" class="btn btn-primary pull-right" onClick={onDeleteClick}>Delete</button>
    </div>
  </div>
);
