import React from 'react';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx'
import DeletePageDialog from './popups/DeletePageDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { list, remove } from '../../../actions/Page';

export default class StaticPages extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Pages list
      pages: [],
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление статическими страницами'
    });

    // Get pages list
    list(
      {},
      (pages) => this.setState({ pages }),
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
      { name: 'title', display: 'Страница', sort: true },
      { name: 'dateCreated', display: 'Добавлена', sort: true, renderer: ({ dateCreated }) => {
        return Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm');
      } },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"static-page/" + row.id}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deletePageHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deletePageDialog = <DeletePageDialog onDeleteClick={this._deletePage.bind(this)} />;
  }

  _deletePage() {
    dispatch('popup:close');

    remove(this.pageToDelete,
      (r) => {
        this.setState({
          pages: this.state.pages.filter(({ id }) => id !== this.pageToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Страница успешно удалена'
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

  deletePageHandler(page, e) {
    e.preventDefault();

    this.pageToDelete = page;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deletePageDialog
    });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Статические страницы</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.pages}
                  >
                    <div class="text-center">Список страниц пуст</div>
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
