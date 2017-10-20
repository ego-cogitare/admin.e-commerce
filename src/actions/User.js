import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function register(user) {
  request('/user', user, 'post',
    (r) => dispatch('user:register:success', r),
    (e) => dispatch('user:register:fail', e)
  );
};

export function list(params) {
  request('/users', params, 'get',
    (r) => dispatch('user:list:success', r),
    (e) => dispatch('user:list:fail', e)
  );
};

export function getChatUsers(success, error) {
    request(`/user/tutor/chat`, {}, 'get', success, error);
};

export function deleteUser(userId, success, error) {
    request(`/user/${userId}`, {}, 'delete', success, error);
};

export function getDialogUsers(success, error) {
    request(`/message/users`, {}, 'get', success, error);
};

export function getUnreadUsers(success, error) {
    request(`/message/unread/allUsers`, {}, 'get', success, error);
};

export function getUser(id, success, error) {
    request(`/user/${id}`, {}, 'get', success, error);
};