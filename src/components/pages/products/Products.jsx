import React from 'react';
import { Link } from 'react-router';

import PowerTable from '../widgets/PowerTable.jsx';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import DeleteProductDialog from './popups/DeleteProductDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, update, remove, addPicture } from '../../../actions/Products';

export default class Products extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Path to upload brand pictures
      path: config.staticFiles,

      // Current selected brand
      selected: {
        id: '',
        title: '',
        categories: [],
        pictures: [],
        pictureId: '',
        description: '',
        relatedProducts: [],
        isNew: true,
        isAction: false,
        discount: 0,
        discountType: '',
        isAvailable: true,
        availableAmount: -1
      },

      // Brands list
      products: [
        {
          id: '1',
          title: 'Продукт №1',
          categories: [],
          pictures: [],
          pictureId: '',
          description: 'Описание продукта №1',
          relatedProducts: [],
          isNew: true,
          isAction: false,
          discount: 0,
          discountType: '',
          isAvailable: true,
          availableAmount: -1
        },
        {
          id: '2',
          title: 'Продукт №2',
          categories: [],
          pictures: [],
          pictureId: '',
          description: 'Описание продукта №2',
          relatedProducts: [],
          isNew: true,
          isAction: false,
          discount: 0,
          discountType: '',
          isAvailable: true,
          availableAmount: -1
        },
      ]
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление продуктами'
    });

    // Get brands list
    // list({ limit: 10, offset: 0 },
    //   (products) => {
    //     this.setState({ products });
    //     // this.brands = brands;
    //   },
    //   (e) => {
    //     dispatch('notification:throw', {
    //       type: 'danger',
    //       title: 'Ошибка',
    //       message: e.responseJSON.error
    //     });
    //   }
    // );

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

    this.deleteProductDialog = <DeleteProductDialog onDeleteClick={this._deleteBrand.bind(this)} />;
  }

  get columns() {
    return [
      // { name: 'picture', width: 5, display: 'Лого', sort: false, renderer: (row) => {
      //   if (!row.pictureId) {
      //     return null;
      //   }
      //   return (
      //     <img
      //       width="30"
      //       height="30"
      //       src={buildUrl(row.pictures.filter(({id}) => id===row.pictureId)[0])}
      //       style={{ objectFit: 'cover' }}
      //     />
      //   );
      // } },
      { name: 'id', display: 'ID', sort: false },
      { name: 'title', display: 'Продукт' },
      { name: 'edit', display: 'Править', width: 10, sort: false, renderer: (row) => {
        return <Link to={"products/" + row.id} onClick={this.selectBrandHandler.bind(this, row)}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deleteBrandHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  filterChangeHandler(e) {
    this.setState({ brands: this.brands.filter((brand) => {
        return brand.title.toLowerCase().match(e.target.value.toLowerCase());
      })
    });
  }

  selectBrandHandler(brand) {
    this.setState({ selected: brand, mode: 'edit' });
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
        this.state.selected.id = r.id;
        this.setState({
            mode: 'edit',
            selected: this.state.selected,
            brands: this.state.brands.concat(this.state.selected)
          },
          () => {
            this.brands = this.brands.concat(this.state.selected);
            onSuccess(r);
          }
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

  deleteBrandHandler(brand, e) {
    e.preventDefault();

    this.brandToDelete = brand;
    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteBrandDialog
    });
  }

  _deleteBrand() {
    dispatch('popup:close');

    remove(this.brandToDelete,
      (r) => {
        this.setState({
          brands: this.state.brands.filter(({id}) => id !== this.brandToDelete.id)
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Брэнд успешно удален'
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

  resetBrandHandler() {
    this.setState({
      mode: 'add',
      selected: {
        id: null,
        title: '',
        pictureId: null,
        pictures: []
      }
    });
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
                <div class="brand-pictures">
                  {
                    (this.state.selected.pictures || []).map((picture) => {
                      return (
                        <div
                          key={picture.id}
                          onClick={this.setBrandPictureHandler.bind(this, picture)}
                          class={"brand-picture".concat(this.state.selected.pictureId === picture.id ? ' selected' : '')}
                        >
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
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addBrandHandler.bind(this)}> Добавить</button> :
                  <div class="btn-group">
                    <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateBrandHandler.bind(this)}> Сохранить</button>
                    <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetBrandHandler.bind(this)}> Новый</button>
                  </div>
              }
            </div>
          </div>

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список продуктов</h3>
            </div>
            <div class="box-body">
              <div class="col-sm-12">
                <div class="row">
                    <PowerTable
                      header={true}
                      footer={true}
                      columns={this.columns}
                      data={this.state.products}
                    >
                    Список продуктов пуст</PowerTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
