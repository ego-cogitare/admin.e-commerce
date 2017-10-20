import { dispatch, subscribe, unsubscribe } from '../../core/helpers/EventEmitter';
import { list                  as _list,
         add                   as _add,
         remove                as _remove,
         info                  as _info,
         listUsers             as _listUsers,
         addUsers              as _addUsers,
         deleteUsers           as _deleteUsers,
         addSelfAssignment     as _addSelfAssignment,
         deleteSelfAssignment  as _deleteSelfAssignment,
         updateSelfAssignment  as _updateSelfAssignment
       } from '../../actions/Course';

subscribe('course:list',                        (params)   => list(params));
subscribe('course:info',                        (courseId) => info(courseId));
subscribe('course:add',                         (params)   => add(params));
subscribe('course:remove',                      (courseId) => remove(courseId));
subscribe('course:users:add',                   (params)   => addUsers(params));
subscribe('course:users:list',                  (courseId) => listUsers(courseId));
subscribe('course:users:delete',                (params)   => deleteUsers(params));
subscribe('course:steps:selfassignment:add',    (params)   => addSelfAssignment(params));
subscribe('course:steps:selfassignment:delete', (params)   => deleteSelfAssignment(params));
subscribe('course:steps:selfassignment:update', (params)   => updateSelfAssignment(params));

subscribe('course:list:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Course list receive fail',
    message: error.responseJSON.message
  });
});

subscribe('course:add:success', (response) => {
  dispatch('notification:throw', {
    type: 'info',
    title: 'Course created',
    message: 'Course successfully created'
  });
});

subscribe('course:add:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Course creating fail',
    message: error.responseJSON.message
  });
});

subscribe('course:remove:success', (response) => {
  dispatch('notification:throw', {
    type: 'warning',
    title: 'Course removed',
    message: 'Course successfully removed'
  });
});

subscribe('course:remove:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Course remove fail',
    message: error.responseJSON.message
  });
});

subscribe('course:info:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Course get info',
    message: error.responseJSON.message
  });
});

subscribe('course:users:list:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Course\'s users list',
    message: error.responseJSON.message
  });
});

subscribe('course:users:add:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Add users to course',
    message: error.responseJSON.message
  });
});

subscribe('course:users:delete:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Delete users from course',
    message: error.responseJSON.message
  });
});

subscribe('course:steps:selfassignment:add:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Error add self assignment',
    message: error.responseJSON.message
  });
});

subscribe('course:steps:selfassignment:delete:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Error delete self assignment',
    message: error.responseJSON.message
  });
});

subscribe('course:steps:selfassignment:update:fail', (error) => {
  dispatch('notification:throw', {
    type: 'danger',
    title: 'Error update self assignment',
    message: error.responseJSON.message
  });
});

export function list(params) {
  _list(params);
};

export function add(params) {
  _add(params);
};

export function remove(courseId) {
  _remove(courseId);
};

export function info(courseId) {
  _info(courseId);
};

export function listUsers(courseId) {
  _listUsers(courseId);
};

export function addUsers(params) {
  _addUsers(params);
};

export function deleteUsers(params) {
  _deleteUsers(params);
};

export function addSelfAssignment(params) {
  _addSelfAssignment(params);
};

export function deleteSelfAssignment(params) {
  _deleteSelfAssignment(params);
};

export function updateSelfAssignment(params) {
  _updateSelfAssignment(params);
};
