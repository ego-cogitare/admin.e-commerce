import React from 'react';
import SelectProductDialog from '../products/popups/RelativeProductsDialog.jsx';
import ProductsList from '../../widgets/ProductsList.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get } from '../../../actions/Order';

export default class Orders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: 'add',

      products: [],

      order: {}
    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование заказа'
    });

    if (this.props.params.id) {
      get({ id: this.props.params.id },
        (order) => this.setState({ order, mode: 'edit' }),
        (e) => {
          dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: e.responseJSON.error
          });
        }
      );
    }
  }

  updateField(field, value) {
    const order = this.state.order;
    order[field] = value;
    this.setState({ order });
  }

  addOrderHandler() {
    const order = Object.assign(
      { productIds: this.state.products.map(({ id }) => id) },
      { ...this.state.order }
    );
    console.log(order);
  }

  updateOrderHandler() {

  }

  resetOrderHandler() {
    this.setState({
      mode: 'add',
      products: [],
      order: {}
    });
  }

  addOrderProduct(products, e) {
    dispatch('popup:close');
    this.setState({
      products: this.state.products.concat(products)
    });
  }

  selectProductDialogOpen() {
    dispatch('popup:show', {
      title: 'Отметьте товары',
      body: this.selectProductDialog
    });
  }

  initDialogs() {
    this.selectProductDialog = <SelectProductDialog
      onSelectClick={this.addOrderProduct.bind(this)}
      selected={this.state.products.map(({ id }) => id)}
      style={{ width:1200 }}
    />;
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Данные о заказе</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label>Товары</label>
                <div class="related-products no-border no-padding">
                  <ProductsList
                    className="related-products no-border no-padding"
                    products={this.state.products}
                    manageControll="trash"
                    onControllClick={(productId) => {
                      this.setState({
                        products: this.state.products.filter(({ id }) => id !== productId)
                      });
                    }}
                  />
                </div>
                <div class="media brand-pictures">
                  <div class="brand-picture empty" onClick={this.selectProductDialogOpen.bind(this)} style={{ width:60, height:60, lineHeight:'58px' }}>+</div>
                </div>
              </div>
              <div class="form-group">
                <label for="orderFirstName">Имя *</label>
                <input
                  type="text"
                  ref="orderFirstName"
                  class="form-control"
                  id="orderFirstName"
                  onChange={(e) => this.updateField('firstName', e.target.value)}
                  value={this.state.order.firstName || ''}
                  placeholder="Введите имя покупателя"
                />
              </div>
              <div class="form-group">
                <label for="orderLastName">Фамилия *</label>
                <input
                  type="text"
                  ref="orderLastName"
                  class="form-control"
                  id="orderLastName"
                  onChange={(e) => this.updateField('lastName', e.target.value)}
                  value={this.state.order.lastName || ''}
                  placeholder="Введите фамилию покупателя"
                />
              </div>
              <div class="form-group">
                <label for="orderPhone">Телефон *</label>
                <input
                  type="text"
                  ref="orderPhone"
                  class="form-control"
                  id="orderPhone"
                  onChange={(e) => this.updateField('phone', e.target.value)}
                  value={this.state.order.phone || ''}
                  placeholder="Введите телефон покупателя"
                />
              </div>
              <div class="form-group">
                <label for="orderEmail">E-mail</label>
                <input
                  type="text"
                  ref="orderEmail"
                  class="form-control"
                  id="orderEmail"
                  onChange={(e) => this.updateField('email', e.target.value)}
                  value={this.state.order.email || ''}
                  placeholder="Введите e-mail покупателя"
                />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addOrderHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateOrderHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetOrderHandler.bind(this)}> Новый</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
