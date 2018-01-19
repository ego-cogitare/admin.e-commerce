import React from 'react';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx'
import DeletePostDialog from './popups/DeletePostDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { list, remove } from '../../../actions/Blog';

export default class BlogPages extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Posts list
      posts: [],
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление блогом'
    });

    // Get posts list
    list(
      {},
      (posts) => this.setState({ posts }),
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
      { name: 'briefly', display: 'Краткое описание', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"blog-page/" + row.id}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deletePostHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deletePostDialog = <DeletePostDialog onDeleteClick={this._deletePost.bind(this)} />;
  }

  _deletePost() {
    dispatch('popup:close');

    remove(
      this.postToDelete,
      (r) => {
        this.setState({
          posts: this.state.posts.filter(({ id }) => id !== this.postToDelete.id),
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Пост успешно удален'
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

  deletePostHandler(post, e) {
    e.preventDefault();

    this.postToDelete = post;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deletePostDialog
    });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Посты</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                  <PowerTable
                    header={true}
                    footer={true}
                    columns={this.columns}
                    data={this.state.posts}
                  >
                    <div class="text-center">Список постов пуст</div>
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
