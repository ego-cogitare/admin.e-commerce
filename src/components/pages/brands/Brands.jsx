import React from 'react';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import BootstrapTable from 'reactjs-bootstrap-table';

export default class AddUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  get columns() {
    return [
      { name: 'firstName', display: 'First name', sort: true },
      { name: 'lastName', display: 'Last name', sort: true },
      { name: 'email', display: 'Email', sort: true },
      { name: 'role', display: 'Role', sort: true },
      { name: 'confirmed', display: 'Confirmed', sort: true, renderer: (row) => row.confirmed ? 'Yes' : 'No' },
    ];
  }

  onSort(colName, dir) {
    switch (dir) {
      case 'asc':
        this.setState({ users: this.state.users.sort((a, b) => a[colName] > b[colName] ? 1 : -1 ) });
      break;

      case 'desc':
        this.setState({ users: this.state.users.sort((a, b) => b[colName] > a[colName] ? 1 : -1 ) });
      break;

      default:
        this.setState({ users: this.state.users });
      break;
    }
  }

  onChange(selection) {
    this.setState({
      selectedUser: this.state.userMap[Object.keys(selection).pop()]
    });
  }

  filter(e) {
    this.setState({ users: this.users
      .filter((el) => {
        return el.name.toLowerCase().match(e.target.value.toLowerCase());
      })
    });
  }

  render() {
    return (
      <div class="row">
        Brands
      </div>
    );
  }
}
