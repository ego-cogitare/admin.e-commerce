import React from 'react';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { get, add, update } from '../../../actions/Blog';

export default class BlogPost extends React.Component {

  constructor(props) {
    super(props);

    this.emptyPost = {
      title: '',
      body: '',
      isVisible: true
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected post
      selected: JSON.parse(JSON.stringify(this.emptyPost)),
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование поста'
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

  addPostHandler() {
    add(
      Object.assign(this.state.selected, { body: this.refs.editor.innerHTML }),
      (selected) => {
        this.setState({
            mode: 'edit',
            selected,
          },
          () => {
            browserHistory.push(`#/blog-page/${selected.id}`);

            dispatch('notification:throw', {
              type: 'success',
              title: 'Успех',
              message: 'Пост успешно добавлен'
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

  updatePostHandler() {
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
              message: 'Пост успешно обновлен'
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

  resetPostHandler() {
    this.setState(
      { selected: JSON.parse(JSON.stringify(this.emptyPost)), mode: 'add' },
      () => browserHistory.push(`#/blog-page`)
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
                <label for="postTitle">Заголовок</label>
                <input
                  type="text"
                  id="postTitle"
                  class="form-control"
                  value={this.state.selected.title}
                  onChange={(e) => {
                    this.state.selected.title = e.target.value;
                    this.setState({ selected: this.state.selected });
                  }}
                  placeholder="Введите заголовок поста"
                />
                <div
                  class="form-control"
                  ref="editor"
                  contentEditable="true"
                  dangerouslySetInnerHTML={{__html: this.state.selected.body}}
                />
              </div>
              <div class="form-group">
                <label for="isPostVisible">Пост видим</label>
                <br/>
                <Checkbox
                  id="isPostVisible"
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
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addPostHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updatePostHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetPostHandler.bind(this)}> Новая</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
