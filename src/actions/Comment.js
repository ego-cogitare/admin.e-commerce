import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function comments({postId}, success, error) {
    request(`/comments/${postId}`, {}, 'get', success, error);
};

export function setApproved(data, success, error) {
    request(`/comments/${data.postId}/set-approved`, data, 'post', success, error);
};
