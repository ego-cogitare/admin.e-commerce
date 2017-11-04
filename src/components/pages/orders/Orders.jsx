import React from 'react';
import { Link } from 'react-router';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, update, remove } from '../../../actions/Order';

export default class Orders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление заказами'
    });
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    // this.deleteСategoryDialog = <DeleteCategoryDialog onDeleteClick={this._deleteCategory.bind(this)} />;
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список заказов</h3>
            </div>
            <div class="box-body">
            </div>
            <div class="box-footer">
              уц
            </div>
          </div>
        </div>
      </div>
    );
  }
}
