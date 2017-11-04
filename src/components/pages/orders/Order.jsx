import React from 'react';
import DeleteOrderDialog from './popups/DeleteOrderDialog.jsx';
import PowerTable from '../../widgets/PowerTable.jsx';
import { Link } from 'react-router';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, update, remove } from '../../../actions/Order';

export default class Orders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      orders: []
    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление заказами'
    });

    list({},
      (orders) => this.setState({ brands }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  get columns() {
    return [
      { name: 'product', display: 'Товар', sort: true },
      { name: 'firstName', display: 'Имя', sort: true },
      { name: 'lastName', display: 'Фамилия', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"brands/" + row.id} onClick={this.selectBrandHandler.bind(this, row)}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deleteBrandHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  initDialogs() {
    this.deleteOrderDialog = <DeleteOrderDialog onDeleteClick={this._deleteOrder.bind(this)} />;
  }

  _deleteOrder() {

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
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.orders}
                  >Список заказов пуст</PowerTable>
                </div>
              </div>
            </div>
            <div class="box-footer">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
