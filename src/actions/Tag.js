import { request } from '../core/helpers/Request';

export function list(params, success, error) {
    request(`/tag/list`, params, 'get', success, error);
};

export function get({ tagId }, success, error) {
    request(`/tag/get/${tagId}`, {}, 'get', success, error);
};

export function add({ title }, success, error) {
    request(`/tag/add`, { title }, 'post', success, error);
};

export function remove({ id }, success, error) {
    request(`/tag/remove/${id}`, {}, 'post', success, error);
};
