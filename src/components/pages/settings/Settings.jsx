import React from 'react';
import { dispatch, subscribe } from '../../../core/helpers/EventEmitter';
import { set } from '../../../actions/Settings';
import Config from '../../../core/helpers/Settings';
import { Currency, HomeSlider, Items } from './partials';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currencyList: [],
      currencyCode: '',
      payment: [],
      delivery: [],
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление настройками магазина'
    });

    subscribe('settings:sync', () => {
      this.setState({
        payment: JSON.parse(Config.data.payment || '[]'),
        delivery: JSON.parse(Config.data.delivery || '[]'),
        currencyList: JSON.parse(Config.data.currencyList || '[]'),
        currencyCode: Config.data.currencyCode || '',
      });
    });
  }

  onCurrencySave(config) {
    set(
      { key: 'currencyCode', data: config.currencyCode },
      (r) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Настройки сохранены'
        });
      },
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    )
  }

  saveItems(items, key) {
    set(
      {
        key,
        data: JSON.stringify(items.map(({id,title}) => ({id,title})))
      },
      (r) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Настройки сохранены'
        });
      },
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    )
  }

  onPaymentsSave(list) {
    this.saveItems(list, 'payment');
  }

  onDeliverySave(list) {
    this.saveItems(list, 'delivery');
  }

  render() {
    return (
      <div class="row settings">
        <div class="col-xs-12">
          <div class="row">
            <div class="col-md-4">
              <Items
                title="Способы доставки"
                items={this.state.delivery}
                onSave={this.onDeliverySave.bind(this)}
              />
            </div>
            <div class="col-md-4">
              <Items
                title="Способы оплаты"
                items={this.state.payment}
                onSave={this.onPaymentsSave.bind(this)}
              />
            </div>
            <div class="col-md-4">
              <Currency
                currencyCode={this.state.currencyCode}
                currencyList={this.state.currencyList}
                onSave={this.onCurrencySave.bind(this)}
              />
            </div>
          </div>
          {/*
          <div class="row">
            <div class="col-md-12">
              <HomeSlider settings={this.state.settings} />
            </div>
          </div>
          */}
        </div>
      </div>
    );
  }
}
