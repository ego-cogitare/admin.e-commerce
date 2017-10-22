import React from 'react';
import BootstrapTable from 'reactjs-bootstrap-table';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, addPicture } from '../../../actions/Brand';

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
      (r) => console.log(r),
      (e) => console.error(e),
    );
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        ref="newDirectoryDialog"
        path={this.state.path}
        onUploadSuccess={(file) => this.addBrandPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;
  }

  get columns() {
    return [
      { name: 'firstName', display: 'First name', sort: true },
      { name: 'lastName', display: 'Last name', sort: true },
      { name: 'email', display: 'Email', sort: true },
      { name: 'role', display: 'Role', sort: true },
      { name: 'confirmed', display: 'Confirmed', sort: true, renderer: (row) => row.confirmed ? 'Yes' : 'No' },
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

  }

  addBrandPictureHandler(brand, picture) {
    const addPicture = (brand, picture) => {
      this._addBrandPicture(brand, picture,
        () => {
          dispatch('notification:throw', {
            type: 'success',
            title: 'Успех',
            message: 'Изображение брэнда добавлено'
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
    };

    (brand.id)
      // Add picture to existing brand
      ? addPicture(brand, picture)

      // Add picture to unexisting brand. First brand should be added
      : this._addBrand(
          (brand) => addPicture(brand, picture),
          () => dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: e.responseJSON.error
          })
      );
  }

  _addBrandPicture(brand, picture, onSuccess = ()=>null, onFail = ()=>null) {
    this.state.selected.pictures = this.state.selected.pictures.concat(picture);
    this.state.selected.id = brand.id;

    addPicture({ brandId: brand.id, pictureId: picture.id },
      (r) => this.setState({ selected: this.state.selected }, ()=>onSuccess(r) ),
      onFail
    );
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
                <input type="text" ref="brandTitle" class="form-control" id="brandTitle" defaultValue={this.state.selected.title} placeholder="Введите название брэнда" />
              </div>
              <div class="form-group">
                <label>Изображения брэнда</label>
                <div class="brand-pictures">
                  {
                    this.state.selected.pictures.map((picture) => {
                      return (
                        <div key={picture.id} class="brand-picture">
                          <img width="100" height="100" src={buildUrl(picture)} alt={picture.name} />
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
                data={this.state.users}
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
