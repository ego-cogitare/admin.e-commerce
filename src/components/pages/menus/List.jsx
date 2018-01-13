import React from 'react';
import { Link } from 'react-router';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx'
import DeleteMenuDialog from './popups/DeleteMenuDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { list, remove } from '../../../actions/Menu';

export default class List extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: []
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Список меню'
    });

    // Get menu list
    list(
      {},
      (list) => this.setState({ list }),
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
      { name: 'title', display: 'Меню', sort: true },
      { name: 'dateCreated', display: 'Добавлена', sort: true, renderer: ({ dateCreated }) => {
        return Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm');
      } },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"menu/" + row.id}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deleteMenuHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deleteMenuDialog = <DeleteMenuDialog onDeleteClick={this._deleteMenu.bind(this)} />;
  }

  _deleteMenu() {
    dispatch('popup:close');

    remove(this.menuToDelete,
      (r) => {
        this.setState({
          list: this.state.list.filter(({ id }) => id !== this.menuToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Меню успешно удалено'
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

  deleteMenuHandler(menu, e) {
    e.preventDefault();

    this.menuToDelete = menu;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteMenuDialog
    });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Меню</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.list}
                  >
                    <div class="text-center">Меню сайта</div>
                  </PowerTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
