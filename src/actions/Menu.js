import { request } from '../core/helpers/Request';

export function get({ id }, success, error) {
    request(`/menu/get/${id}`, {}, 'get', success, error);
};

export function update(data, success, error) {
    request(`/menu/update/${data.id}`, data, 'post', success, error);
};

export function remove({ id }, success, error) {
    request(`/menu/remove/${id}`, {}, 'post', success, error);
};

export function bootstrap(success, error) {
    request(`/menu/bootstrap`, {}, 'get', success, error);
};
