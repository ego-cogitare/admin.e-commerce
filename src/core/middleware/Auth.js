import { hashHistory } from 'react-router';
import { dispatch, subscribe } from '../../core/helpers/EventEmitter';
import AuthProvider from '../../actions/Auth';

export default new class {

  get logoutErrorCode() {
    return 401;
  }

  get loginRoute() {
    return '/login';
  }

  get authorizedCookies() {
    return 'loggedIn=true';
  }

  get unauthorizedCookies() {
    return 'loggedIn=false';
  }

  login(data) {
    // Set authorization cookies
    document.cookie = this.authorizedCookies;

    // Save loggined user data
    localStorage.setItem('user', JSON.stringify(data));

    // Redirect to default route
    location.href = '/';
  }

  logout() {
    // Set unauthorization cookies
    document.cookie = this.unauthorizedCookies;

    // Redirect to login route
    hashHistory.push(this.loginRoute);
  }

  constructor() {
    // Listen for every request status error
    subscribe('request:result', (r) => {
      if (typeof r !== 'undefined' && r.status === this.logoutErrorCode) {
        this.logout();
      }
    });
    subscribe('login:success', (r) => {
      this.login(r);
    });
    subscribe('login:fail', (e) => {
      dispatch('notification:throw', {
        type: 'danger',
        title: 'Login failed',
        message: e.responseJSON.error
      });
    });
    subscribe('logout:success', (r) => {
      // Remove cookies
      this.logout();
    });
    subscribe('logout:fail', (e) => {
      // Remove cookies
      this.logout();
    });
  }

  routeEnter(prevState, replace) {
    this.checkLoggedIn(prevState, replace);
  }

  routeChange(prevState, nextState, replace) {
    this.checkLoggedIn(prevState, replace);
  }

  checkLoggedIn(prevState, replace) {
    const cookiesSet = document.cookie.match(this.authorizedCookies);
    const requestRoute = prevState.location.pathname;

    if (!cookiesSet && requestRoute !== this.loginRoute) {
      replace(this.loginRoute);
    }
    if (cookiesSet && requestRoute === this.loginRoute) {
      replace('/');
    }
  }
};
