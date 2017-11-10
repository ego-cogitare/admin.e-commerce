import { request } from '../core/helpers/Request';

export function get(success, error) {
    request(`/settings/get`, {}, 'get', success, error);
};

export function set(data, success, error) {
    request(`/settings/set`, data, 'post', success, error);
};
