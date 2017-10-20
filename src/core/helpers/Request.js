import { dispatch } from './EventEmitter';

export function request(url, params, type, onSuccess, onFail = ()=>{}) {
  let result = jQuery.ajax({
      url: url.match(/^http:\/\//) ? url : config.backUrl + url,
      data: params,
      dataType: 'json',
      type: type,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
  });

  return (typeof onSuccess === 'undefined') ? result :
    result
      .done(onSuccess)
      .fail(onFail)
      .always((r) => dispatch('request:result', r));
};
