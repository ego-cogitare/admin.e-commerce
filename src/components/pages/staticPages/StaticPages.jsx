import React from 'react';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx'
import DeletePageDialog from './popups/DeletePageDialog.jsx';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { list, get, add, update, remove } from '../../../actions/Page';

export default class StaticPages extends React.Component {

  constructor(props) {
    super(props);

    this.emptyPage = {
      title: '',
      body: '',
      isVisible: true
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected page
      selected: JSON.parse(JSON.stringify(this.emptyPage)),

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

    if (this.props.params.id)
    {
      get(
        { id: this.props.params.id },
        (r) => this.setState({
            selected: r,
            mode: 'edit'
          },
          () => this.initTextEditor()
        ),
        (e) => {
          dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: e.responseJSON.error
          });
        }
      );
    }
    else
    {
      this.initTextEditor();
    }
  }

  initTextEditor() {
    $(this.refs.editor).trumbowyg(config.trumbowyg);
  }

  get columns() {
    return [
      { name: 'title', display: 'Страница', sort: true },
      { name: 'dateCreated', display: 'Добавлена', sort: true, renderer: ({ dateCreated }) => {
        return Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm');
      } },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"static-pages/" + row.id} onClick={this.selectPageHandler.bind(this, row)}><span class="fa fa-edit"></span></Link>;
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
          mode: 'add',
          pages: this.state.pages.filter(({ id }) => id !== this.pageToDelete.id),
          selected: JSON.parse(JSON.stringify(this.emptyPage))
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

  selectPageHandler(page, e) {
    e.preventDefault();

    this.setState({
        selected: page,
        mode: 'edit'
      },
      () => browserHistory.push(`#/static-pages/${page.id}`)
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

  addPageHandler() {
    add(
      Object.assign(this.state.selected, { body: this.refs.editor.innerHTML }),
      (selected) => {
        this.setState({
            mode: 'edit',
            selected,
            pages: this.state.pages.concat(selected)
          },
          () => {
            browserHistory.push(`#/static-pages/${selected.id}`);

            dispatch('notification:throw', {
              type: 'success',
              title: 'Успех',
              message: 'Страница успешно добавлена'
            });
          }
        );
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

  updatePageHandler() {
    const selected = this.state.selected;
    selected.body = this.refs.editor.innerHTML;

    update(
      this.state.selected,
      (selected) => {
        this.setState({
            selected: this.state.selected
          },
          () => {
            dispatch('notification:throw', {
              type: 'success',
              title: 'Успех',
              message: 'Страница успешно обновлена'
            });
          }
        );
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

  resetPageHandler() {
    this.setState({
      selected: JSON.parse(JSON.stringify(this.emptyPage))
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

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Cтраница</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="pageTitle">Заголовок</label>
                <input
                  type="text"
                  id="pageTitle"
                  class="form-control"
                  value={this.state.selected.title}
                  onChange={(e) => {
                    this.state.selected.title = e.target.value;
                    this.setState({ selected: this.state.selected });
                  }}
                  placeholder="Введите заголовок страницы"
                />
                <div
                  class="form-control"
                  ref="editor"
                  contentEditable="true"
                  dangerouslySetInnerHTML={{__html: this.state.selected.body}}
                />
              </div>
              <div class="form-group">
                <label for="pageTitle">Страница видима</label>
                <br/>
                <Checkbox
                  id="isCategoryHidden"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isVisible}
                  onChange={(e) => {
                    const selected = this.state.selected;
                    selected.isVisible = !e.target.checked;
                    this.setState({ selected });
                  }}
                />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addPageHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updatePageHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetPageHandler.bind(this)}> Новая</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
