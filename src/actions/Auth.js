import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function login(username, password) {
  request('/login', { username, password }, 'post',
    (r) => dispatch('login:success', r),
    (e) => dispatch('login:fail', e)
  );
};

export function logout() {
  request('/logout', {}, 'post',
    (r) => dispatch('logout:success', r),
    (e) => dispatch('logout:fail', e)
  );
};
