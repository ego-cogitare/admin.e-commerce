import React from 'react';

export default class Select2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      value: this.props.value,
    };
  }

  componentWillReceiveProps({ data, value }) {
    this.setState({ data, value }, () => this._initSelect());
  }

  componentDidMount() {
    this.refs.select.multiple = this.props.multiple || false;
  }

  componentWillUnmount() {
    $(this.refs.select).select2('destroy');
  }

  _getOptionById(id) {
    return this.state.data.filter((option) => id === option.id)[0];
  }

  _initSelect() {
    console.log(this.state.data)
    $(this.refs.select).select2({
      data: this.state.data,
      templateResult: (node) => {
        return $(`<span style="padding-left:${(this.props.nestedOffset || 20) * (node.level || 0)}px">${node.title}</span>`);
      },
      initSelection : (element, callback) => {
        const selected = (this.state.value || [])
          .map((id) => this._getOptionById(id))
          .filter((id) => id);

        callback(selected);
      }
    })
    .off('change')
    .on('change', (e) => {
      const selected = $(this.refs.select).val();

      this.props.multiple ?
        this.props.onChange(selected || []) :
        this.props.onChange(selected || '');
    });

    this.props.value && $(this.refs.select).val(this.props.value);
  }

  render() {
    return (
      <select
        ref="select"
        style={this.props.style}
        data-placeholder={this.props.placeholder}
      ></select>
    );
  }
}
