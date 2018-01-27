import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function reviews({productId}, success, error) {
    request(`/reviews/${productId}`, {}, 'get', success, error);
};

export function setApproved(data, success, error) {
    request(`/reviews/${data.productId}/set-approved`, data, 'post', success, error);
};
