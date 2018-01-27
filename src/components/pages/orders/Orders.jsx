import React from 'react';
import DeleteOrderDialog from './popups/DeleteOrderDialog.jsx';
import PowerTable from '../../widgets/PowerTable.jsx';
import { Link } from 'react-router';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, remove } from '../../../actions/Order';
import Settings from '../../../core/helpers/Settings';

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
      (orders) => this.setState({ orders }),
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
      { name: 'product', display: 'Товар', sort: true, renderer: (row) => {
        return row.products
          .map(({ title, count }) => `${title} (${count} шт.)`)
          .join(', ')
          //.concat('…');
      } },
      { name: 'stateId', display: 'Состояние', sort: true, renderer: ({ stateId }) => {
        const state = (JSON.parse(Settings.get('productStates')) || []).find(({[stateId]:state}) => state);
        return Object.values(state || {})[0];
      } },
      { name: 'userName', display: 'Имя', sort: true },
      { name: 'address', display: 'Адрес', sort: true },
      { name: 'phone', display: 'Телефон', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return (
          <Link to={"order/" + row.id}><span class="fa fa-edit"></span></Link>
        )
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return (
          <a href="#" onClick={this.deleteOrderHandler.bind(this, row)}>
            <span class="fa fa-trash"></span>
          </a>
        )
      } },
    ];
  }

  initDialogs() {
    this.deleteOrderDialog = <DeleteOrderDialog onDeleteClick={this._deleteOrder.bind(this)} />;
  }

  deleteOrderHandler(order) {
    this.orderToDelete = order;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteOrderDialog
    });
  }

  _deleteOrder() {
    dispatch('popup:close');

    remove(
      this.orderToDelete,
      (r) => {
        this.setState({
          mode: 'add',
          orders: this.state.orders.filter(({id}) => id !== this.orderToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Заказ успешно удален'
        });
      },
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
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
                  >
                    <div class="text-center">Список заказов пуст</div>
                  </PowerTable>
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
