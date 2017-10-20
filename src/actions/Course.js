import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function list(params) {
  request('/courses', params, 'get',
    (r) => dispatch('course:list:success', r),
    (e) => dispatch('course:list:fail', e)
  );
};

export function add(params) {
  request('/course', params, 'post',
    (r) => dispatch('course:add:success', r),
    (e) => dispatch('course:add:fail', e)
  );
};

export function remove(id) {
  request('/course', { id }, 'delete',
    (r) => dispatch('course:remove:success', r),
    (e) => dispatch('course:remove:fail', e)
  );
};

export function info(id) {
  request('/course', { id }, 'get',
    (r) => dispatch('course:info:success', r),
    (e) => dispatch('course:info:fail', e)
  );
}

export function listUsers(courseId) {
  request('/subscriptions/byCourse/' + courseId, {}, 'get',
    (r) => dispatch('course:users:list:success', r),
    (e) => dispatch('course:users:list:fail', e)
  );
};

export function addUsers(params) {
  request('/subscription', params, 'post',
    (r) => dispatch('course:users:add:success', r),
    (e) => dispatch('course:users:add:fail', e)
  );
};

export function deleteUsers(id) {
  request('/subscription?' + jQuery.param({ id }), { id }, 'delete',
    (r) => dispatch('course:users:delete:success', r),
    (e) => dispatch('course:users:delete:fail', e)
  );
};

export function getCourse(id, success, error) {
  request('/course', { id }, 'get', success, error);
}

export function saveCourse(data, success, error) {
  request('/course', data, 'put', success, error);
}

export function cloneCourse(id, success, error) {
  request(`/course/clone/${id}`, {}, 'post', success, error);
}
