import React from 'react';

export default class Discount extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      discountLabels: this.props.discountLabels,
      discountLabel: '',
      discountValue: '',
      discountType: '',
      defaultValue: {}
    };
  }

  _getLabelByKey(k) {
    return (this.props.discountLabels.find(({key, value}) => k === key)).value;
  }

  componentWillReceiveProps({ discountLabels, defaultValue }) {
    defaultValue = defaultValue || Object.assign({}, this.props.discountLabels[0], { value: 0 });

    this.setState({
      discountLabels,
      defaultValue,
      discountLabel: this._getLabelByKey(defaultValue.key),
      discountType: defaultValue.key,
      discountValue: defaultValue.value,
    },
    () => {
      this.refs.discountValue.disabled = !this.state.defaultValue.key;
    });
  }

  discountChange(e) {
    const pattern = /[^\d\.]/g;

    if (e.target.value.match(pattern)) {
      e.preventDefault();
      e.target.value = e.target.value.replace(pattern, '');
      return false;
    }

    this.setState({
      discountValue: e.target.value
    },
    () => {
      this.props.onChange({
        discountType: this.state.discountType,
        discountValue: this.state.discountValue,
      });
    });
  }

  discountTypeChange(discountType, discountLabel, e) {
    e.preventDefault();

    this.props.onChange({
      discountType,
      discountValue: this.state.discountValue || 0,
    });

    this.setState({ discountType, discountLabel }, () => {
      this.refs.discountValue.disabled = !discountType;
    });
  }

  render() {
    return (
      <div class="discount-widget">
        <input
          type="text"
          ref="discountValue"
          class={this.props.className}
          id={this.props.id}
          placeholder="0"
          onChange={this.discountChange.bind(this)}
          value={this.state.discountValue}
          style={{ width: 60 }}
        />
        <div class="input-group-btn pull-left">
          <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">{ this.state.discountLabel }
            <span class="fa fa-caret-down"></span>
          </button>
          <ul class="dropdown-menu">
            {
              this.state.discountLabels.map(({key, value}) => (
                <li key={key}>
                  <a href="#" onClick={this.discountTypeChange.bind(this, key, value)}>{value}</a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}
