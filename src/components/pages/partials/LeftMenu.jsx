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
            <li class="treeview">
              <a href="#">
                <i class="fa fa-tv"></i> <span>Товары</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <li>
                  <Link to="/products" activeClassName="active">
                    <i class="fa fa-circle-o"></i> <span>Каталог</span>
                  </Link>
                </li>
                <li>
                  <Link to="/import" activeClassName="active">
                    <i class="fa fa-circle-o"></i> <span>Импорт</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li class="treeview">
              <a href="#">
                <i class="fa fa-shopping-cart"></i> <span>Заказы</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <li>
                  <Link to="/orders" activeClassName="active">
                    <i class="fa fa-circle-o"></i> <span>Список</span>
                  </Link>
                </li>
                <li>
                  <Link to="/order" activeClassName="active">
                    <i class="fa fa-circle-o"></i> <span>Добавить</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/static-pages" activeClassName="active">
                <i class="fa fa-file-code-o"></i> <span>Cтраницы</span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}
