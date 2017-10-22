import React from 'react';
import { Link } from 'react-router';
import BootstrapTable from 'reactjs-bootstrap-table';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, update, addPicture } from '../../../actions/Brand';

export default class AddUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Path to upload brand pictures
      path: '/uploads',

      // Current selected brand
      selected: {
        title: '',
        pictureId: null,
        pictures: []
      },

      // Brands list
      brands: []
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление брэндами'
    });

    // Get brands list
    list({ limit: 10, offset: 0 },
      (r) => this.setState({ brands: r }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );

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

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addBrandPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;
  }

  get columns() {
    return [
      { name: 'picture', width: 5, display: 'Лого', sort: false, renderer: (row) => {
        return null;
      } },
      { name: 'title', display: 'Брэнд', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"brands/" + row.id}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.removeBrandHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  onSort(colName, dir) {
    switch (dir) {
      case 'asc':
        this.setState({ users: this.state.users.sort((a, b) => a[colName] > b[colName] ? 1 : -1 ) });
      break;

      case 'desc':
        this.setState({ users: this.state.users.sort((a, b) => b[colName] > a[colName] ? 1 : -1 ) });
      break;

      default:
        this.setState({ users: this.state.users });
      break;
    }
  }

  onChange(selection) {
    this.setState({
      selectedUser: this.state.userMap[Object.keys(selection).pop()]
    });
  }

  filter(e) {
    this.setState({ users: this.users
      .filter((el) => {
        return el.name.toLowerCase().match(e.target.value.toLowerCase());
      })
    });
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

  _addBrand(onSuccess = ()=>null, onFail = ()=>null) {
    this.state.selected.title = this.refs.brandTitle.value;

    add({ ...this.state.selected },
      (r) => {
        this.setState({ mode: 'edit', selected: this.state.selected }, () => {
          onSuccess(r);
        });
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
      () => {
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
      () => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  addBrandPictureHandler(brand, picture) {
    addPicture({ brandId: brand.id, pictureId: picture.id },
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

  removeBrandHandler() {

  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Добавить новый брэнд</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="brandTitle">Название брэнда</label>
                <input type="text" ref="brandTitle" class="form-control" id="brandTitle" onChange={this.brandTitleChange.bind(this)} value={this.state.selected.title} placeholder="Введите название брэнда" />
              </div>
              <div class="form-group">
                <label>Изображения брэнда</label>
                <div class="brand-pictures">
                  {
                    this.state.selected.pictures.map((picture) => {
                      return (
                        <div key={picture.id} class={"brand-picture".concat(this.state.selected.pictureId === picture.id ? ' selected' : '')}>
                          <img src={`${buildUrl(picture)}`} />
                        </div>
                      );
                    })
                  }
                  <div class="brand-picture empty" onClick={this._uploadFiles.bind(this)}>+</div>
                </div>
              </div>
            </div>
            <div class="box-footer">
              {
                (this.state.mode === 'add') ?
                  <button type="submit" class="btn btn-primary" onClick={this.addBrandHandler.bind(this)}>Добавить</button> :
                  <button type="submit" class="btn btn-primary" onClick={this.updateBrandHandler.bind(this)}>Сохранить</button>
              }
            </div>
          </div>

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список брэндов</h3>
            </div>
            <div class="box-body data-table-container">
              <BootstrapTable
                columns={this.columns}
                data={this.state.brands}
                headers={true}
                resize={true}
                select="single"
                selected={this.state.selection}
                onSort={this.onSort.bind(this)}
                onChange={this.onChange.bind(this)}
              >
                <div class="text-center">Список брэндов пуст.</div>
              </BootstrapTable>
              <br/>
              {/* this.state.selectedUser.id &&
                 <div>
                  { `${this.state.selectedUser.firstName} ${this.state.selectedUser.lastName}  ` }
                  <button className="btn btn-danger" onClick={this.deleteUser.bind(this)}>Delete</button>
                </div>
               */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
