import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/category/list`, params, 'get', success, error);
};

export function tree(params, success, error) {
    request(`/category/tree`, params, 'get', success, error);
};

export function treeUpdate(params, success, error) {
    request(`/category/tree`, params, 'post', success, error);
};

export function update(data, success, error) {
    request(`/category/update/${data.id}`, data, 'post', success, error);
};

export function remove({ id }, success, error) {
    request(`/category/remove/${id}`, {}, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/category/get/${id}`, {}, 'get', success, error);
};

export function bootstrap(success, error) {
    request(`/category/bootstrap`, {}, 'get', success, error);
};

export function addPicture({ category, picture }, success, error) {
    request(`/category/add-picture/${category.id}`, { picture }, 'post', success, error);
};

export function deletePicture(data, success, error) {
    request(`/category/delete-picture`, data, 'post', success, error);
};
