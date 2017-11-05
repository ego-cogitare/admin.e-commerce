import React from 'react';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { get, add, update } from '../../../actions/Page';

export default class StaticPage extends React.Component {

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
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование страницы'
    });

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

  addPageHandler() {
    add(
      Object.assign(this.state.selected, { body: this.refs.editor.innerHTML }),
      (selected) => {
        this.setState({
            mode: 'edit',
            selected,
          },
          () => {
            browserHistory.push(`#/static-page/${selected.id}`);

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
    this.setState(
      { selected: JSON.parse(JSON.stringify(this.emptyPage)), mode: 'add' },
      () => browserHistory.push(`#/static-page`)
    );
  }

  render() {
    return (
      <div class="row">
        <div class="col-xs-12">
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
