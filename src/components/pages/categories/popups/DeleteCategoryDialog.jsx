import React from 'react';
import { dispatch } from '../../../../core/helpers/EventEmitter';

export default ({ onDeleteClick }) => (
  <div>
    <div class="modal-body">
      Вы подтверждаете удаление категории?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Отмена</button>
      <button type="button" class="btn btn-primary pull-right" onClick={onDeleteClick}>Удалить</button>
    </div>
  </div>
);
