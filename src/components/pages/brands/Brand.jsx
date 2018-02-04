import React from 'react';
import { Link } from 'react-router';
import PicturesList from '../../widgets/PicturesList.jsx';
import DeletePictureDialog from './popups/DeletePictureDialog.jsx';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadPictureDialog from '../fileManager/popup/UploadFile.jsx';
import UploadCoverDialog from '../fileManager/popup/UploadFile.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get, add, update, remove, bootstrap, addPicture,
  deletePicture, addCover, deleteCover } from '../../../actions/Brand';

export default class Brands extends React.Component {

  constructor(props) {
    super(props);

    this.emptyBrand = {
      id: null,
      title: '',
      pictureId: null,
      pictures: [],
      coverId: null,
      covers: [],
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Path to upload brand pictures
      path: config.staticFiles,

      // Current selected brand
      selected: JSON.parse(JSON.stringify(this.emptyBrand)),
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование брэнда'
    });

    if (this.props.params.id)
    {
      get({ id: this.props.params.id },
        (brand) => {
          this.setState({ selected: brand, mode: 'edit' });
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
    else
    {
      // this.initTextEditor();
      this.getBootstrapBrand();
    }
  }

  initDialogs() {
    this.uploadPictureDialog = <UploadPictureDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addBrandPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;

    this.uploadCoverDialog = <UploadCoverDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addBrandCoverHandler(this.state.selected, file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;

    this.deletePictureDialog = <DeletePictureDialog
      onDeleteClick={this._doDeletePicture.bind(this)}
    />;

    this.deleteCoverPictureDialog = <DeletePictureDialog
      onDeleteClick={this._doDeleteCover.bind(this)}
    />;
  }

  getBootstrapBrand() {
    bootstrap(
      (bootstrap) => this.setState({
        selected: bootstrap,
        mode: 'add'
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

  brandTitleChange(e) {
    this.state.selected.title = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  _uploadPicture() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadPictureDialog
    });
  }

  _uploadCover() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadCoverDialog
    });
  }

  _deletePicture(picture) {
    this.pictureToDelete = picture;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deletePictureDialog
    });
  }

  _deleteCover(picture) {
    this.coverPictureToDelete = picture;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteCoverPictureDialog
    });
  }

  _doDeletePicture() {
    dispatch('popup:close');

    deletePicture(
      Object.assign(this.pictureToDelete, { brandId: this.state.selected.id }),
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

  _doDeleteCover() {
    dispatch('popup:close');

    deleteCover(
      Object.assign(this.coverPictureToDelete, { brandId: this.state.selected.id }),
      (r) => {
        const selected = this.state.selected;

        // Delete brand picture from pictures list
        selected.covers = selected.covers.filter(
          ({ id }) => id !== this.coverPictureToDelete.id
        );

        // If brand active picture deleted
        if (selected.coverId === this.coverPictureToDelete.id) {
          selected.coverId = null;
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

  _addBrand(onSuccess = ()=>null, onFail = ()=>null) {
    this.state.selected.title = this.refs.brandTitle.value;

    add(
      { ...this.state.selected },
      (r) => {
        this.state.selected.id = r.id;
        this.setState({
            mode: 'edit',
            selected: this.state.selected,
          },
          () => onSuccess(r)
        );
      },
      onFail
    );
  }

  updateBrandHandler(e) {
    e.preventDefault();

    const data = Object.assign(
      { ...this.state.selected },
      { pictures: this.state.selected.pictures.map(({id}) => id) },
      { covers: this.state.selected.covers.map(({id}) => id) }
    );

    update(
      data,
      (brand) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Брэнд успешно обновлен'
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

  addBrandPictureHandler({ id: brandId }, picture) {
    addPicture(
      { brandId, pictureId: picture.id },
      (r) => {
        this.state.selected.pictures.push(picture);
        this.setState(
          {
            selected: this.state.selected,
            mode: 'edit'
          },
          () => dispatch('notification:throw', {
                  type: 'success',
                  title: 'Успех',
                  message: 'Превью брэнда добавлено'
                })
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

  addBrandCoverHandler({ id: brandId }, picture) {
    addCover(
      { brandId, coverId: picture.id },
      (r) => {
        this.state.selected.covers.push(picture);
        this.setState({
            selected: this.state.selected,
            mode: 'edit'
          },
          () => dispatch('notification:throw', {
                  type: 'success',
                  title: 'Успех',
                  message: 'Постер брэнда добавлен'
                })
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

  setBrandPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
    this.setState({ selected: this.state.selected });
  }

  setBrandCoverHandler({ id }, e) {
    this.state.selected.coverId = id;
    this.setState({ selected: this.state.selected });
  }

  resetBrandHandler() {
    this.setState({
      mode: 'add',
      selected: JSON.parse(JSON.stringify(this.emptyBrand))
    });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Брэнд</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="brandTitle">Название брэнда *</label>
                <input
                  type="text"
                  ref="brandTitle"
                  class="form-control"
                  id="brandTitle"
                  onChange={this.brandTitleChange.bind(this)}
                  value={this.state.selected.title || ''}
                  placeholder="Введите название брэнда"
                />
              </div>
              <div class="form-group">
                <label>Превью брэнда (для главной страницы)</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setBrandPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadPicture.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deletePicture.bind(this)}
                />
              </div>
              <div class="form-group">
                <label>Постер брэнда (страница брэнда)</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.covers}
                  activePictureId={this.state.selected.coverId}
                  onSelect={this.setBrandCoverHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadCover.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deleteCover.bind(this)}
                />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateBrandHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateBrandHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetBrandHandler.bind(this)}> Новый</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
