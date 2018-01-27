import React from 'react';
import SelectProductDialog from '../products/popups/RelativeProductsDialog.jsx';
import ProductsList from '../../widgets/ProductsList.jsx';
import Select2 from '../../widgets/Select2.jsx';
import Settings from '../../../core/helpers/Settings';
import { browserHistory } from 'react-router';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get, add, update } from '../../../actions/Order';
import { get as getSettings } from '../../../actions/Settings';

export default class Order extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: 'add',

      products: [],

      states: JSON.parse(Settings.get('productStates'))
        .map(( setting ) => {
          return {
            id: Object.keys(setting)[0],
            text: Object.values(setting)[0]
          };
        }),

      order: {}
    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование заказа'
    });

    if (this.props.params.id) {
      get(
        { id: this.props.params.id },
        (order) => this.setState({ order, products: order.products, mode: 'edit' }),
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
      { products: this.state.products.map(({ id, count }) => ({ id, count})) },
      { ...this.state.order }
    );

    add(
      order,
      ({ id }) => {
        this.state.order.id = id;
        this.setState({
            mode: 'edit',
            order: this.state.order
          },
          () => {
            browserHistory.push(`#/order/${id}`);

            dispatch('notification:throw', {
              type: 'success',
              title: 'Успех',
              message: 'Заказ успешно добавлен'
            });
          }
        );
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

  updateOrderHandler() {
    const order = Object.assign(
      { ...this.state.order },
      { products: this.state.products
          .map(({ id, count }) => ({ id, count}))
          .filter(({ count }) => count > 0)
      },
    );

    update(
      order,
      () => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Заказ успешно сохранен'
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

  resetOrderHandler() {
    this.setState({
        mode: 'add',
        products: [],
        order: {}
      },
      () => browserHistory.push(`#/order`)
    );
  }

  addOrderProduct(products, e) {
    dispatch('popup:close');
    this.setState({
      products: this.state.products.concat(
        products.map((product) => Object.assign(product, { count: 1 }))
      )
    });
  }

  selectProductDialogOpen() {
    dispatch('popup:show', {
      title: 'Отметьте товары',
      body: this.selectProductDialog
    });
  }

  initDialogs() {
    this.selectProductDialog =
      <SelectProductDialog
        manageControll={['checkbox']}
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
                <label>Товары *</label>
                <div class="related-products no-border no-padding">
                  <ProductsList
                    className="related-products no-border no-padding"
                    products={this.state.products}
                    manageControll={['trash', 'number']}
                    onControllClick={(productId, controllType) => {
                      // If remove product controll clicked
                      (controllType === 'trash') && this.setState({
                        products: this.state.products.filter(({ id }) => id !== productId)
                      });
                    }}
                  />
                </div>
                <div class="media pictures-list">
                  <div class="picture empty" onClick={this.selectProductDialogOpen.bind(this)} style={{ width:60, height:60, lineHeight:'58px' }}>+</div>
                </div>
              </div>
              <div class="form-group">
                <label for="orderUserName">Имя *</label>
                <input
                  type="text"
                  ref="orderUserName"
                  class="form-control"
                  id="orderUserName"
                  onChange={(e) => this.updateField('userName', e.target.value)}
                  value={this.state.order.userName || ''}
                  placeholder="Введите имя покупателя"
                />
              </div>
              <div class="form-group">
                <label for="orderAddress">Адрес *</label>
                <input
                  type="text"
                  ref="orderAddress"
                  class="form-control"
                  id="orderAddress"
                  onChange={(e) => this.updateField('address', e.target.value)}
                  value={this.state.order.address || ''}
                  placeholder="Введите адрес доставки"
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
              <div class="form-group">
                <label for="productBrand">Текущее состояние заказа *</label>
                <Select2
                  style={{ width: '100%' }}
                  nestedOffset="0"
                  multiple={false}
                  placeholder="Текущее состояние заказа"
                  onChange={(stateId) => {
                    this.updateField('stateId', stateId);
                  }}
                  data={this.state.states}
                  value={[ this.state.order.stateId ]}
                />
              </div>
              <div class="form-group">
                <label for="orderComment">Комментарий</label>
                <textarea
                  ref="orderComment"
                  class="form-control"
                  id="orderComment"
                  onChange={(e) => this.updateField('comment', e.target.value)}
                  value={this.state.order.comment || ''}
                  placeholder="Введите комментарий к заказу"
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
