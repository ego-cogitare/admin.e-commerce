import { dispatch, subscribe, unsubscribe } from '../../core/helpers/EventEmitter';
import { register as _register, list as _list } from '../../actions/User';

subscribe('user:register', (user) => register(user));
subscribe('user:list', (params) => list(params));
subscribe('user:register:success', (response) => {
  dispatch('notification:throw', {
    type: 'info',
    title: 'User registered',
    message: 'User added successfully'
  });
});

subscribe('user:register:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'User add fail',
    message: error.responseJSON.message
  });
});

subscribe('user:list:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'User list fail',
    message: error.responseJSON.message
  });
});

export function register(user) {
  _register(user);
};

export function list(params) {
  _list(params);
};
