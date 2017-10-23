import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function currencyList(success, error) {
    request(`/settings/get`, {}, 'get', success, error);
};
