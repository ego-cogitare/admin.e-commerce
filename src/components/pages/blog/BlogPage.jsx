import React from 'react';
import Select2 from '../../widgets/Select2.jsx';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { browserHistory, Link } from 'react-router';
import { get, bootstrap, update, addPicture, deletePicture } from '../../../actions/Blog';
import { list as tagsList, add as tagAdd } from '../../../actions/Tag';
import DeletePictureDialog from './popups/DeletePictureDialog.jsx';
import PicturesList from '../../widgets/PicturesList.jsx';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';

export default class BlogPost extends React.Component {

  constructor(props) {
    super(props);

    this.emptyPost = {
      title: '',
      briefly: '',
      body: '',
      tags: [],
      pictures: [],
      pictureId: '',
      showOnHome: false,
      isDeleted: false,
      isVisible: true
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected post
      selected: JSON.parse(JSON.stringify(this.emptyPost)),

      tags: [],

      tagIds: []
    };
  }

  getBootstrapPost() {
    bootstrap(
      (bootstrap) => {
        this.setState(
          {
            selected: bootstrap,
            tagIds: [],
            mode: 'add'
          },
          () => {
            this.fetchTags();
            browserHistory.push(`#/blog-page/${bootstrap.id}`);
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

  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        path={config.staticFiles}
        onUploadSuccess={(file) => this.addPostPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => {
          dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: JSON.stringify(file)
          });
        }}
      />;

    this.deletePictureDialog =
      <DeletePictureDialog
        onDeleteClick={this._doDeletePicture.bind(this)}
      />;
  }

  addPostPictureHandler(post, picture) {
    addPicture({ post, picture },
      (r) => {
        const selected = this.state.selected;
        selected.pictures.push(picture);
        this.setState({ selected });
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

  setPostPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
    this.setState({ selected: this.state.selected });
  }

  // Fetch tags list
  fetchTags() {
    tagsList({},
      (tags) => this.setState({
        tags: tags.map((tag) => Object.assign(tag, { text: tag.title }))
      }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование поста'
    });

    this.fetchTags();

    if (this.props.params.id)
    {
      get(
        { id: this.props.params.id },
        (r) => this.setState({
            selected: r,
            tagIds: (r.tags || []).map(({ id }) => id),
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
      this.getBootstrapPost();
    }
  }

  initTextEditor() {
    $(this.refs.editor).trumbowyg(config.trumbowyg);
  }

  _uploadFiles() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadFileDialog
    });
  }

  _deletePicture(picture) {
    this.pictureToDelete = picture;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deletePictureDialog
    });
  }

  _doDeletePicture() {
    dispatch('popup:close');

    deletePicture(
      Object.assign(this.pictureToDelete, { postId: this.state.selected.id }),
      (r) => {
        const selected = this.state.selected;

        // Delete brand picture from pictures list
        selected.pictures = selected.pictures.filter(
          ({ id }) => id !== this.pictureToDelete.id
        );

        // If brand active picture deleted
        if (selected.pictureId === this.pictureToDelete.id) {
          selected.pictureId = null;
        }

        this.setState({ selected });

        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Изображение успешно удалено'
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

  updatePostHandler() {
    let post = JSON.parse(JSON.stringify(this.state.selected));

    Object.assign(post, {
      body: this.refs.editor.innerHTML,
      pictures: post.pictures.map(({ id }) => id),
      tags: this.state.tagIds
    });

    update(post,
      (post) => {
        this.setState({
            selected: post
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

  // Add tag
  addTag(title) {
    tagAdd(
      { title },
      (tag) => {
        this.state.tags.push(Object.assign(tag, { text: tag.title }));
        this.state.tagIds.push(tag.id);
        this.setState({
          tags: this.state.tags,
          tagIds: this.state.tagIds,
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
              <h3 class="box-title">Cтраница</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="postTitle">Заголовок *</label>
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
              </div>
              <div class="form-group">
                <label for="postBriefly">Краткое описание *</label>
                <textarea
                  id="postBriefly"
                  class="form-control"
                  value={this.state.selected.briefly || ''}
                  onChange={(e) => {
                    this.state.selected.briefly = e.target.value;
                    this.setState({ selected: this.state.selected });
                  }}
                  placeholder="Введите краткое описание поста"
                />
              </div>
              <div class="form-group">
                <label>Полное описание *</label>
                <div
                  class="form-control"
                  ref="editor"
                  contentEditable="true"
                  dangerouslySetInnerHTML={{__html: this.state.selected.body}}
                />
              </div>
              <div class="form-group">
                <label>Изображения поста *</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setPostPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadFiles.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deletePicture.bind(this)}
                />
              </div>
              <div class="form-group">
                <label for="showOnHome">Показать на главной</label>
                <br/>
                <Checkbox
                  id="showOnHome"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.showOnHome}
                  onChange={(e) => {
                    const selected = this.state.selected;
                    selected.showOnHome = !e.target.checked;
                    this.setState({ selected });
                  }}
                />
              </div>
              <div class="form-group">
                <label for="productBrand">Теги</label>
                <Select2
                  style={{ width: '100%' }}
                  nestedOffset="30"
                  multiple={true}
                  placeholder="Теги"
                  onChange={(tagIds) => this.setState({ tagIds })}
                  noResultsText="Нажмите Enter для добавления тега."
                  onCustomInput={this.addTag.bind(this)}
                  data={this.state.tags}
                  value={this.state.tagIds}
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
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updatePostHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updatePostHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.getBootstrapPost.bind(this)}> Новый пост</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
