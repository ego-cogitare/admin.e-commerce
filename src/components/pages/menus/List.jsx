import React from 'react';
import { Link } from 'react-router';
import PicturesList from '../../widgets/PicturesList.jsx';
import DeletePictureDialog from './popups/DeletePictureDialog.jsx';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get, add, update, remove, addPicture, deletePicture } from '../../../actions/Brand';

export default class List extends React.Component {

  constructor(props) {
    super(props);

    this.emptyBrand = {
      id: null,
      title: '',
      pictureId: null,
      pictures: []
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

    if (this.props.params.id) {
      get({ id: this.props.params.id },
        (r) => this.setState({ selected: r, mode: 'edit' }),
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

  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addBrandPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;

    this.deletePictureDialog = <DeletePictureDialog onDeleteClick={this._doDeletePicture.bind(this)} />;
  }

  brandTitleChange(e) {
    this.state.selected.title = e.target.value;
    this.setState({ selected: this.state.selected });
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

  addBrandHandler(e) {
    e.preventDefault();

    this._addBrand(
      (brand) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Брэнд успешно добавлен'
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

  updateBrandHandler(e) {
    e.preventDefault();

    update({ ...this.state.selected },
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

  addBrandPictureHandler(brand, picture) {
    addPicture({ brand, picture },
      (r) => {
        this.setState({ selected: r, mode: 'edit' }, () => {
          dispatch('notification:throw', {
            type: 'success',
            title: 'Успех',
            message: 'Изображение брэнда добавлено'
          });
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

  setBrandPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
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
                <label>Изображения брэнда</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setBrandPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadFiles.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deletePicture.bind(this)}
                />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addBrandHandler.bind(this)}> Добавить</button> :
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
