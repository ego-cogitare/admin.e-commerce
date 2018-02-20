import React from 'react';
import DeleteCallbackDialog from './popups/DeleteCallbackDialog.jsx';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx';
import { Link } from 'react-router';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, remove } from '../../../actions/Callback';
import Settings from '../../../core/helpers/Settings';

export default class Callbacks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      callbacks: []
    };
  }

  componentWillMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Покупка в один клик'
    });

    list({},
      (callbacks) => this.setState({ callbacks }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  get columns() {
    return [
      { name: 'name', display: 'Имя', sort: true },
      { name: 'phone', display: 'Телефон', sort: true },
      { name: 'isProcessed', display: 'Обработано', sort: true, renderer: ({isProcessed}) => {
        return isProcessed ? 'Да' : 'Нет';
      } },
      { name: 'dateCreated', display: 'Добавлено', sort: true, renderer: ({ dateCreated }) => {
        return Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm');
      } },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return (
          <Link to={"callback/" + row.id}><span class="fa fa-edit"></span></Link>
        )
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return (
          <a href="#" onClick={this.deleteCallbackHandler.bind(this, row)}>
            <span class="fa fa-trash"></span>
          </a>
        )
      } },
    ];
  }

  initDialogs() {
    this.deleteCallbackDialog = <DeleteCallbackDialog onDeleteClick={this._deleteCallback.bind(this)} />;
  }

  deleteCallbackHandler(callback, e) {
    e.preventDefault();
    this.callbackToDelete = callback;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteCallbackDialog
    });
  }

  _deleteCallback() {
    dispatch('popup:close');

    remove(
      this.callbackToDelete,
      (r) => {
        this.setState({
          callbacks: this.state.callbacks.filter(({id}) => id !== this.callbackToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Запись успешно удалена'
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
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список заявок</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.callbacks}
                  >
                    <div class="text-center">Список заявок пуст</div>
                  </PowerTable>
                </div>
              </div>
            </div>
            <div class="box-footer">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
