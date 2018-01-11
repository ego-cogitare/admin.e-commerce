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

export function get({ id }, success, error) {
    request(`/product/get/${id}`, {}, 'get', success, error);
};

export function bootstrap(success, error) {
    request(`/product/bootstrap`, {}, 'get', success, error);
};

export function addPicture({ product, picture }, success, error) {
    request(`/product/add-picture/${product.id}`, { picture }, 'post', success, error);
};

export function deletePicture(data, success, error) {
    request(`/product/delete-picture`, data, 'post', success, error);
};

export function properties(params, success, error) {
    request(`/product/properties`, params, 'get', success, error);
};

export function addProperty(data, success, error) {
    request(`/product/add-property`, data, 'post', success, error);
};

export function updateProperty(data, success, error) {
    request(`/product/update-property/${data.id}`, data, 'post', success, error);
};

export function removeProperty(data, success, error) {
    request(`/product/remove-property/${data.id}`, {}, 'post', success, error);
};
