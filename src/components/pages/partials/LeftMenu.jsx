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

  render() {
    return (
      <aside class="main-sidebar">
        <section class="sidebar">
          <ul class="sidebar-menu">
            <li>
              <Link to="/categories" activeClassName="active"><i class="fa fa-th-large"></i> <span>Категории</span></Link>
            </li>
            <li>
              <Link to="/brands" activeClassName="active"><i class="fa fa-apple"></i> <span>Бренды</span></Link>
            </li>
            <li>
              <Link to="/products" activeClassName="active"><i class="fa fa-tv"></i> <span>Товары</span></Link>
            </li>
            <li>
              <Link to="/static-pages" activeClassName="active"><i class="fa fa-file-code-o"></i> <span>Cтатические страницы</span></Link>
            </li>
            {/*<li>
              <Link to="/file-manager" activeClassName="active"><i class="fa fa-link"></i> <span>Файловый менеджер</span></Link>
            </li>
            <li>
              <Link to="/users" activeClassName="active"><i class="fa fa-user"></i> <span>Пользователи</span></Link>
            </li>*/}
          </ul>
        </section>
      </aside>
    );
  }
}
