import React from 'react';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import Config from '../../../core/helpers/Settings';
import { Currency, HomeSlider } from './partials';

export default class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      settings: Config.data
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление настройками магазина'
    });
  }

  render() {
    return (
      <div class="row settings">
        <div class="col-xs-12">
          <div class="row">
            <div class="col-md-6">
              <Currency settings={this.state.settings} />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <HomeSlider settings={this.state.settings} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
