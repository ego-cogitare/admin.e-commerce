import { request } from '../core/helpers/Request';

export function listByCourse({ courseId }, success, fail) {
  request(`/lection/byCourse/${courseId}`, null, 'get', success, fail);
};

export function add(data, success, fail) {
  request('/lection', data, 'post', success, fail);
};

export function update(data, success, fail) {
  request(`/lection/${data.lectionId}`, data, 'put', success, fail);
};

export function remove({ lectionId }, success, fail) {
  request(`/lection/${lectionId}`, null, 'delete', success, fail);
};

export function get({ lectionId }, success, fail) {
  request(`/lection/${lectionId}`, null, 'get', success, fail);
};

export function stepsListById({ lectionId }, success, fail) {
  request(`/steps?lectionId=${lectionId}`, null, 'get', success, fail);
};

export function stepAdd(data, success, fail) {
  request(`/step`, data, 'post', success, fail);
};

export function getStepsByUser({ userId, lectionId }, success, fail) {
  request(`/steps/byUser/${userId}/byLection/${lectionId}`, null, 'get', success, fail);
};
