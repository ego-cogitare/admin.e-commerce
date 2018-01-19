import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/blog/list`, params, 'get', success, error);
};

export function get({ id }, success, error) {
    request(`/blog/get/${id}`, {}, 'get', success, error);
};

export function bootstrap(success, error) {
    request(`/blog/bootstrap`, {}, 'get', success, error);
};

export function update(data, success, error) {
    request(`/blog/update/${data.id}`, data, 'post', success, error);
};

export function remove(data, success, error) {
    request(`/blog/remove/${data.id}`, {}, 'post', success, error);
};

export function addPicture({ post, picture }, success, error) {
    request(`/blog/add-picture/${post.id}`, { picture }, 'post', success, error);
};

export function deletePicture(data, success, error) {
    request(`/blog/delete-picture`, data, 'post', success, error);
};
