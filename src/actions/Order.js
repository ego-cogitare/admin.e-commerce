import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/order/list`, params, 'get', success, error);
};

export function add(data, success, error) {
    request(`/order/add`, data, 'post', success, error);
};

export function update(data, success, error) {
    request(`/order/update/${data.id}`, data, 'post', success, error);
};

export function remove(data, success, error) {
    request(`/order/remove/${data.id}`, {}, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/order/get/${id}`, {}, 'get', success, error);
};
