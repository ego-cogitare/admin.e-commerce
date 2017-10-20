import React from 'react';

export default class Filter extends React.Component {
  render() {
    return (
      <div class="filter input-group">
        <input
          class="form-control"
          type="text"
          onChange={this.props.onFilterChange}
          placeholder="Type filter keyword"
          ref={node => this.filterInput = node}
        />
        <span class="input-group-addon"><i class="fa fa-search"></i></span>
      </div>
    );
  }
}
