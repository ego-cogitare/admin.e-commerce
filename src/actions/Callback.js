import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/callback/list`, params, 'get', success, error);
};

export function update(data, success, error) {
    request(`/callback/update/${data.id}`, data, 'post', success, error);
};

export function remove(data, success, error) {
    request(`/callback/remove/${data.id}`, {}, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/callback/get/${id}`, {}, 'get', success, error);
};
