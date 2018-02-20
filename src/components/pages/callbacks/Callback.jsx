import React from 'react';
import { Checkbox } from 'react-icheck';
import Settings from '../../../core/helpers/Settings';
import { buildUrl } from '../../../core/helpers/Utils';
import { get, update } from '../../../actions/Callback';
import { get as getSettings } from '../../../actions/Settings';
import { dispatch } from '../../../core/helpers/EventEmitter';

export default class Callback extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      callback: {}
    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование заявки'
    });

    if (this.props.params.id) {
      get(
        { id: this.props.params.id },
        (callback) => this.setState({ callback }),
        (e) => {
          dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: e.responseJSON.error
          });
        }
      );
    }
  }

  updateField(field, value) {
    const callback = this.state.callback;
    callback[field] = value;
    this.setState({ callback });
  }

  updateCallbackHandler() {
    update(
      this.state.callback,
      () => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Заявка успешно обновлена'
        });
      },
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  render() {
    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Данные о заявке</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="callbackUserName">Имя *</label>
                <input
                  type="text"
                  ref="callbackUserName"
                  class="form-control"
                  id="orderUserName"
                  onChange={(e) => this.updateField('name', e.target.value)}
                  value={this.state.callback.name || ''}
                  placeholder="Введите имя покупателя"
                />
              </div>
              <div class="form-group">
                <label for="orderPhone">Телефон *</label>
                <input
                  type="text"
                  ref="callbackPhone"
                  class="form-control"
                  id="callbackPhone"
                  onChange={(e) => this.updateField('phone', e.target.value)}
                  value={this.state.callback.phone || ''}
                  placeholder="Введите телефон покупателя"
                />
              </div>
              <div class="form-group">
                <label for="callbackComment">Комментарий</label>
                <textarea
                  ref="callbackComment"
                  class="form-control"
                  id="orderComment"
                  onChange={(e) => this.updateField('comment', e.target.value)}
                  value={this.state.callback.comment || ''}
                  placeholder="Введите комментарий к заявке"
                />
              </div>
              <div class="form-group">
                <label for="pageTitle">Отметить как обработан</label>
                <br/>
                <Checkbox
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.callback.isProcessed}
                  onChange={(e) => {
                    this.state.callback.isProcessed = !e.target.checked;
                    this.setState({ callback: this.state.callback });
                  }}
                />
              </div>
            </div>
            <div class="box-footer">
              <div class="btn-group">
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateCallbackHandler.bind(this)}> Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
