import { request } from '../core/helpers/Request';

export function get({ id }, success, fail) {
  request('/step', { id }, 'get', success, fail);
};

export function update(params, success, fail) {
  request('/step', params, 'put', success, fail);
};

export function remove({ id }, success, fail) {
  request('/step', { id }, 'delete', success, fail);
};

// export function addSelfAssignment(params, success, fail) {
//   request('/step/add/self-assigment', params, 'post', success, fail);
// };
//
// export function deleteSelfAssignment(params, success, fail) {
//   request('/step/remove/self-assigment', params, 'post', success, fail);
// };
//
// export function updateSelfAssignment(params, success, fail) {
//   request('/step/update/self-assigment', params, 'post', success, fail);
// };
