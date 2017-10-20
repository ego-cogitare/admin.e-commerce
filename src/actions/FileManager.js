import { request } from '../core/helpers/Request';
import {  dispatch, subscribe, unsubscribe } from '../core/helpers/EventEmitter';

subscribe('file-manager:directory:load', (payload) => loadDirectory(payload.path));
subscribe('file-manager:directory:create', (payload) => createDirectory(payload));
subscribe('file-manager:file:delete', (payload) => deleteFile(payload));

export let directoryFiles = [];

export let directoryPath = "/";

export function createDirectory(data) {
  request(
    '/file/createDirectory.json', data, 'post',
    (r) => dispatch('file-manager:directory:created', data),
    (e) => dispatch('notification:throw', {
      type: 'danger',
      title: 'Directory create error',
      message: e.responseJSON.message
    })
  );
};

export function loadDirectory(path) {
  request(
    '/files.json', { path }, 'get',
    (r) => {
      directoryFiles = r;
      directoryPath = path;
      dispatch('file-manager:directory:loaded', { path, directoryFiles });
    },
    (e) => dispatch('notification:throw', {
      type: 'danger',
      title: 'Files list error',
      message: e.responseJSON.message
    })
  );
};

export function deleteFile(params) {
  request(
    '/file.json?' + $.param(params), {}, 'delete',
    (r) => dispatch('file-manager:file:deleted', params),
    (e) => dispatch('notification:throw', {
      type: 'danger',
      title: 'File delete error',
      message: e.responseJSON.message
    })
  );
};
