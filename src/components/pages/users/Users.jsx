import React from 'react';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import User from '../../../core/middleware/User';
import { deleteUser } from '../../../actions/User';
import BootstrapTable from 'reactjs-bootstrap-table';

export default class AddUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = { users: [], userMap: {}, selectedUser: {} };
    this.registerSuccess = this.registerSuccessListener.bind(this);
    this.userListSuccess = this.userListSuccessListener.bind(this);
  }

  componentWillMount() {
    dispatch(
      'page:titles:change', {
        pageTitle: 'Users'
      }
    );
    dispatch('user:list', {
      page: 0,
      count: 999,
      roles: ['ROLE_COORDINATOR', 'ROLE_USER', 'ROLE_TUTOR']
    });
    subscribe('user:register:success', this.registerSuccess);
    subscribe('user:list:success', this.userListSuccess);
  }

  registerSuccessListener() {
    this.refs.firstName.value = "";
    this.refs.lastName.value = "";
    this.refs.email.value = "";
    this.refs.role.value = "ROLE_ADMIN";

    dispatch('user:list', {
      page: 0,
      count: 999,
      roles: ['ROLE_COORDINATOR', 'ROLE_USER', 'ROLE_TUTOR']
    });
  }

  userListSuccessListener(users) {
    this.users = users.content;
    let userMap = {};
    users.content.forEach((user) => {
      userMap[user.id] = user;
    });
    this.setState({ users: users.content, userMap: userMap });
  }

  componentWillUnmount() {
    unsubscribe('user:register:success', this.registerSuccess);
    unsubscribe('user:list:success', this.userListSuccess);
  }

  registerUser() {
    const user = {
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value,
      email: this.refs.email.value,
      role: this.refs.role.value,
    };
    dispatch('user:register', user);
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

  deleteUser() {
    let confirmed = confirm(`Delete user: ${this.state.selectedUser.firstName} ${this.state.selectedUser.lastName}`);
    if (!confirmed) return;

    deleteUser(this.state.selectedUser.id, () => {
       this.setState({
        selectedUser: {}
      });

      dispatch('user:list', {
        page: 0,
        count: 999,
        roles: ['ROLE_COORDINATOR', 'ROLE_USER', 'ROLE_TUTOR']
      });

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
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Add new user</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label>First name</label>
                <input ref="firstName" type="text" class="form-control" placeholder="Enter user first name" />
              </div>
              <div class="form-group">
                <label>Last name</label>
                <input ref="lastName" type="text" class="form-control" placeholder="Enter user last name" />
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">User Email</label>
                <input ref="email" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter user email" />
              </div>
              <div class="form-group">
                <label>User Role</label>
                <select ref="role" class="form-control select2 select2-hidden-accessible" data-placeholder="Select user role" aria-hidden="true">
                  <option value="ROLE_TUTOR">Tutor</option>
                  <option value="ROLE_COORDINATOR">Coordinator</option>
                  <option value="ROLE_USER">User</option>
                </select>
              </div>
            </div>
            <div class="box-footer">
              <button type="submit" class="btn btn-primary pull-right" onClick={this.registerUser.bind(this)}>Add user</button>
            </div>
          </div>
        </div>
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Users List</h3>
            </div>

            <div style={{ margin: '10px 10px 0', height: '34px' }}>
              <b>Displayed:</b> {this.state.users.length} record
              <div class="input-group pull-right" style={{ width: '230px' }}>
                <input type="text" class="form-control" onChange={this.filter.bind(this)} placeholder="Type filter keyword" />
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
            </div>

            <div class="box-body data-table-container">
              <BootstrapTable
                columns={this.columns}
                data={this.state.users}
                headers={true}
                resize={true}
                select="single"
                selected={this.state.selection}
                onSort={this.onSort.bind(this)}
                onChange={this.onChange.bind(this)}
              >
                <div class="text-center">Nothing to display.</div>
              </BootstrapTable>
              <br/>
              { this.state.selectedUser.id &&
                 <div>
                  { `${this.state.selectedUser.firstName} ${this.state.selectedUser.lastName}  ` }
                  <button className="btn btn-danger" onClick={this.deleteUser.bind(this)}>Delete</button>
                </div>
               }
             
            </div>
          </div>
        </div>
      </div>
    );
  }
}
