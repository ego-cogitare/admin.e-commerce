import { request } from '../core/helpers/Request';

export function get({ menuId }, success, error) {
    request(`/menu/${menuId}/get`, {}, 'get', success, error);
};

export function update(data, success, error) {
    request(`/menu/${data.menuId}/update`, data, 'post', success, error);
};

export function itemAdd(data, success, error) {
    request(`/menu/${data.menuId}/item-add`, data, 'post', success, error);
};

export function itemUpdate(data, success, error) {
    request(`/menu/${data.menuId}/item-update/${data.id}`, data, 'post', success, error);
};

export function itemRemove({ menuId, id }, success, error) {
    request(`/menu/${menuId}/item-remove/${id}`, {}, 'post', success, error);
};

// export function bootstrap(success, error) {
//     request(`/menu/bootstrap`, {}, 'get', success, error);
// };
