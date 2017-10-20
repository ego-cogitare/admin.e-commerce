import { request } from '../core/helpers/Request';
export function clearStream(courseId, success, error) {
 request(`/message/delete/channel/${courseId}`, {}, 'delete',
    (r) => success,
    (e) => error
  );
}