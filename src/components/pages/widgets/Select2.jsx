import React from 'react';

export default class Select2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      initialized: false
    };
  }

  componentWillReceiveProps({ data }) {
    if (data.length === 0) {
      return false;
    }
    this.setState({ data }, () => this._initSelect());
  }

  componentWillUnmount() {
    $(this.refs.select).select2('destroy');
  }

  _getOptionById(id) {
    return this.state.data.filter((option) => id === option.id)[0];
  }

  _initSelect() {
    $(this.refs.select).select2({
      data: this.state.data,
      templateResult: (node) => {
        return $(`<span style="padding-left:${(this.props.nestedOffset || 20) * (node.level || 0)}px">${node.title}</span>`);
      },
      initSelection : (element, callback) => {
        const selected = this.state.initialized ?
          ($(this.refs.select).val() || []).map((id) => this._getOptionById(id)) :
          (this.props.value || []).map((id) => this._getOptionById(id));
          // this.props.value;

        callback(selected);
      }
    })
    .off('change')
    .on('change', (e) => this.props.onChange($(this.refs.select).val() || []));

    if (!this.state.initialized) {
      this.setState({ initialized: true }, () => {
        this.props.value && $(this.refs.select).val(this.props.value);
      });
    }
  }

  render() {
    return (
      <select
        ref="select"
        multiple
        style={this.props.style}
        data-placeholder={this.props.placeholder}
      ></select>
    );
  }
}
