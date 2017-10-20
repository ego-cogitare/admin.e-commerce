import React from 'react';
import { login as doLogin } from '../../actions/Auth';
import '../../staticFiles/js/plugins/iCheck/icheck.min';
import '../../staticFiles/js/plugins/iCheck/square/blue.css';
import Notifications from '../../core/ui/Notifications.jsx';

export default class Login extends React.Component {

  handleLogin(e) {
    e.preventDefault();
    const login = this.refs.login.value;
    const password = this.refs.password.value;
    doLogin(login, password);
  }

  componentDidMount() {
    $(this.refs.rememberMe).iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%'
    });
  }

  render() {
    return (
      <div class="hold-transition login-page">
        <Notifications limit="3" />
        <div class="login-box">
          <div class="login-logo">
            <b>Admin</b>
          </div>
          <div class="login-box-body">
            <p class="login-box-msg">Sign in to start your session</p>
            <form onSubmit={this.handleLogin.bind(this)}>
              <div class="form-group has-feedback">
                <input type="email" defaultValue="" class="form-control" placeholder="Email" ref="login" />
                <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
              </div>
              <div class="form-group has-feedback">
                <input type="password" defaultValue="" class="form-control" placeholder="Password" ref="password" />
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
              </div>
              <div class="row">
                <div class="col-xs-8">
                  <div class="checkbox icheck">
                    <label>
                      <input type="checkbox" ref="rememberMe" defaultChecked={false} /> Remember Me
                    </label>
                  </div>
                </div>
                <div class="col-xs-4">
                  <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
