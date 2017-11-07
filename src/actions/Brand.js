import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params, success, error) {
    request(`/brand/list`, params, 'get', success, error);
};

export function add(data, success, error) {
    request(`/brand/add`, data, 'post', success, error);
};

export function update(data, success, error) {
    request(`/brand/update/${data.id}`, data, 'post', success, error);
};

export function remove(data, success, error) {
    request(`/brand/remove/${data.id}`, {}, 'post', success, error);
};

export function addPicture(data, success, error) {
    request(`/brand/add-picture`, data, 'post', success, error);
};

export function deletePicture(data, success, error) {
    request(`/brand/delete-picture`, data, 'post', success, error);
};

export function get({ id }, success, error) {
    request(`/brand/get/${id}`, {}, 'get', success, error);
};
