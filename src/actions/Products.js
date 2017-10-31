import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/product/list`, params, 'get', success, error);
};

export function update(data, success, error) {
    request(`/product/update/${data.id}`, data, 'post', success, error);
};

export function remove(data, success, error) {
    request(`/product/remove/${data.id}`, {}, 'post', success, error);
};

export function addPicture(data, success, error) {
    request(`/product/add-picture`, data, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/product/get/${id}`, {}, 'get', success, error);
};

export function bootstrap(success, error) {
    request(`/product/bootstrap`, {}, 'get', success, error);
};
