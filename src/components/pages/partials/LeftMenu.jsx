import React from 'react';
import { Link } from 'react-router';

export default class LeftMenu extends React.Component {

  constructor(props) {
    super(props);

    // Get logged user data
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    this.state = {
      loggedUser,
      coursesList: []
    };
  }

  componentWillMount() {

  }

  render() {
    return (
      <aside class="main-sidebar">
        <section class="sidebar">
          <ul class="sidebar-menu">
            <li>
              <Link to="/courses" activeClassName="active"><i class="fa fa-link"></i> <span>Courses</span></Link>
            </li>
            <li>
              <Link to="/quiz" activeClassName="active"><i class="fa fa-link"></i> <span>Quiz</span></Link>
            </li>
            <li>
              <Link to="/users" activeClassName="active"><i class="fa fa-link"></i> <span>Users</span></Link>
            </li>
            <li>
              <Link to="/file-manager" activeClassName="active"><i class="fa fa-link"></i> <span>File manager</span></Link>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}
