import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/category/list`, params, 'get', success, error);
};

export function add(data, success, error) {
    request(`/category/add`, data, 'post', success, error);
};

export function update({ id }, success, error) {
    request(`/category/update/${id}`, data, 'post', success, error);
};

export function remove({ id }, success, error) {
    request(`/category/remove/${id}`, {}, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/category/get/${id}`, {}, 'get', success, error);
};
