import React from 'react';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import BootstrapTable from 'reactjs-bootstrap-table';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';

export default class AddUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      path: '/uploads',

      brands: [
        {
          id: 1,
          title: 'Brand #1',
          pictureId: 112,
          pictures: [
            {
              id: 110,
              path: 'files/brands/brand-01.png'
            },
            {
              id: 111,
              path: 'files/brands/brand-02.png'
            },
            {
              id: 112,
              path: 'files/brands/brand-03.png'
            },
          ]
        }
      ]
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление брэндами'
    });
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        ref="newDirectoryDialog"
        path={this.state.path}
        onUploadSuccess={(file) => console.log('Uploaded file', file)}
        onUploadFail={(file) => console.log('Error', file)}
      />;
  }

  uploadFiles() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadFileDialog
    });
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

  uploadBrandPicture() {
    this.uploadFiles();
  }

  addBrand(e) {
    e.preventDefault();

    console.log(this);
    console.log(e.target);
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
                <input type="text" ref="brandTitle" class="form-control" id="brandTitle" placeholder="Введите название брэнда" />
              </div>
              <div class="form-group">
                <label>Изображения брэнда</label>
                <div class="brands">
                  {
                    this.state.brands.map((brand) => {
                      return (
                        <div key={brand.id} class="brand">{brand.id}</div>
                      );
                    })
                  }
                  <div class="brand empty" onClick={this.uploadBrandPicture.bind(this)}>+</div>
                </div>
              </div>
            </div>
            <div class="box-footer">
              <button type="submit" class="btn btn-primary" onClick={this.addBrand.bind(this)}>Добавить</button>
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
                <div class="text-center">Ниодного брэнда небыло добавлено.</div>
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
