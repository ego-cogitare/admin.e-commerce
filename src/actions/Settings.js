import { request } from '../core/helpers/Request';

export function get(success, error) {
    request(`/settings/get`, {}, 'get', success, error);
};
