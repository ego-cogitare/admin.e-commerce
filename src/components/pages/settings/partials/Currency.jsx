import React from 'react';
import { Radio, RadioGroup } from 'react-icheck';

export default class Currency extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currencyCode: '',
      currencyList: [],
      currencyCource: ''
    };
  }

  componentWillReceiveProps({currencyList, currencyCode}) {
    this.setState({
      currencyList,
      currencyCode,
    });
  }

  currencyChangeHandler(e) {
    this.setState({ currencyCode: e.target.value });
  }

  currencyCourceChangeHandler(e) {
    this.setState({ currencyCource: e.target.value });
  }

  addNewCurrencyCodeHandler() {
    var code = this.refs.newCurrencyCode.value;

    // If length of code less than 3 chars or currence already in a list
    if (code.length !== 3 || this.state.currencyList.indexOf(code) !== -1) {
      return false;
    }

    this.setState({
      currencyList: this.state.currencyList.concat(code)
    },
    () => {
      this.refs.newCurrencyCode.value = '';
    });
  }

  render() {
    return (
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Валюта магазина</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="form-group currency">
            <RadioGroup name="radio" value={this.state.currencyCode}>
              {
                this.state.currencyList.map((currencyCode) => (
                  <Radio
                    key={currencyCode}
                    value={currencyCode}
                    radioClass="iradio_square-blue"
                    increaseArea="20%"
                    label={currencyCode}
                    onClick={this.currencyChangeHandler.bind(this)}
                  />
                ))
              }
            </RadioGroup>
          </div>
          {/*
          <div class="form-group">
            <input
              type="text"
              ref="newCurrencyCode"
              placeholder="Код"
              maxLength="3"
              onKeyDown={(e) => e.keyCode === 13 && this.addNewCurrencyCodeHandler()}
              onChange={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g,'').toUpperCase() }
              style={{ width: 60 }}
            />
            <input
              defaultValue="Добавить"
              type="button"
              class="btn btn-sm btn-primary"
              onClick={this.addNewCurrencyCodeHandler.bind(this)}
              style={{ padding: '3px 10px', verticalAlign: 'top', marginLeft: 3 }}
            />
          </div>
          <div class="input-group text-bold">
            1 USD (<i class="fa fa-usd"></i>) =
            <input
              type="text"
              value={this.state.currencyCource}
              onChange={this.currencyCourceChangeHandler.bind(this)}
              style={{ width: '60px', marginLeft: '5px' }}
            />
            <span style={{ marginLeft: '5px' }}>{this.state.currencyCode}</span>
          </div>
          */}
        </div>
        <div class="box-footer">
          <button type="submit" class="btn btn-primary fa fa-check" onClick={() => this.props.onSave(this.state)}>Сохранить</button>
        </div>
      </div>
    );
  }
}
