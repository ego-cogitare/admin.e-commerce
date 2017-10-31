import React from 'react';
import { Link } from 'react-router';
import Settings from '../../../core/helpers/Settings';
import PowerTable from '../widgets/PowerTable.jsx';
import Select2 from '../widgets/Select2.jsx';
import Discount from '../widgets/Discount.jsx';
import { Checkbox } from 'react-icheck';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import DeleteProductDialog from './popups/DeleteProductDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { bootstrap, list, get, update, remove, addPicture } from '../../../actions/Products';
import { tree as categoryTree } from '../../../actions/Category';

export default class Products extends React.Component {

  constructor(props) {
    super(props);

    this.emptyProduct = {
      id: '',
      title: '',
      description: '',
      categories: [],
      // categories: ['59f6fd721d41c805753670a2', '59f4e5bf1d41c806e5144ef3'],
      pictures: [],
      pictureId: '',
      // relatedProducts: [],
      relatedProducts: [
        {
          id: '59f6fd721d41c805753670a2',
        },
        {
          id: '59f4e5bf1d41c806e5144ef3',
        }
      ],
      isNovelty: false,
      isAuction: false,
      discount: 0,
      discountType: '',
      isAvailable: true,
      availableAmount: -1
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Path to upload brand pictures
      path: config.staticFiles,

      // Current selected brand
      selected: JSON.parse(JSON.stringify(this.emptyProduct)),

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
      ],

      categories: []
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление продуктами'
    });

    // Get bootstrap product
    bootstrap(
      (bootstrap) => {
        this.setState({
          selected: bootstrap
        },
        () => {
          // Get categories list
          categoryTree({},
            (categories) => {
              let tree = [];
              categories.forEach((category) => {
                tree = tree.concat(this.categoryBranch(category));
              });
              this.setState({ categories: tree });
            },
            (e) => {
              dispatch('notification:throw', {
                type: 'danger',
                title: 'Ошибка',
                message: e.responseJSON.error
              });
            }
          );
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

    // if (this.props.params.id) {
    //   get({ id: this.props.params.id },
    //     (r) => this.setState({ selected: r, mode: 'edit' }),
    //     (e) => {
    //       dispatch('notification:throw', {
    //         type: 'danger',
    //         title: 'Ошибка',
    //         message: e.responseJSON.error
    //       });
    //     }
    //   );
    // }
  }

  categoryBranch(category, branch = [], depth = 0) {
    branch.push(
      Object.assign(category, { level: depth, text: category.title })
    );

    if (!category.categories) {
      return branch;
    }

    category.categories.forEach(
      (category) => this.categoryBranch(category, branch, depth + 1)
    );

    return branch;
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.uploadFileDialog =
      <UploadFileDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addProductPictureHandler(this.state.selected, file)}
        onUploadFail={(file) => {
          dispatch('notification:throw', {
            type: 'danger',
            title: 'Ошибка',
            message: JSON.stringify(file)
          });
        }}
      />;

    this.deleteProductDialog = <DeleteProductDialog onDeleteClick={this._deleteProduct.bind(this)} />;
  }

  get columns() {
    return [
      { name: 'id', display: 'ID', sort: false },
      { name: 'picture', width: 5, display: 'Фото', sort: false, renderer: (row) => {
        if (!row.pictureId) { return null; }
        return (
          <img
            width="30"
            height="30"
            src={buildUrl(row.pictures.filter(({ id }) => id === row.pictureId)[0])}
            style={{ objectFit: 'cover' }}
          />
        );
      } },
      { name: 'title', display: 'Продукт' },
      { name: 'edit', display: 'Править', width: 10, sort: false, renderer: (row) => (
          <Link to={"products/" + row.id}
            onClick={this.selectProductHandler.bind(this, row)}>
            <span class="fa fa-edit"></span>
          </Link>
        )
      },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => (
          <a href="#"
            onClick={this.deleteProductHandler.bind(this, row)}>
            <span class="fa fa-trash"></span>
          </a>
        )
      },
    ];
  }

  selectProductHandler(product) {
    this.setState({
      selected: product,
      mode: 'edit'
    });
  }

  productTitleChange(e) {
    this.state.selected.title = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  productDescriptionChange(e) {
    this.state.selected.description = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  _uploadFiles() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadFileDialog
    });
  }

  updateProductHandler(e) {
    e.preventDefault();

    update({ ...this.state.selected },
      (brand) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Продукт успешно сохранён'
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

  addBrandPictureHandler(product, picture) {
    addPicture({ product, picture },
      (r) => {
        this.setState({ selected: r, mode: 'edit' }, () => {
          dispatch('notification:throw', {
            type: 'success',
            title: 'Успех',
            message: 'Изображение продукта добавлено'
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

  setProductPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
    this.setState({
      selected: this.state.selected
    });
  }

  deleteProductHandler(product, e) {
    e.preventDefault();

    this.productToDelete = product;
    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteProductDialog
    });
  }

  _deleteProduct() {
    dispatch('popup:close');

    remove(Object.assign({ ...this.state.selected }, { id: this.productToDelete.id }),
      (r) => {
        this.setState({
          products: this.state.products.filter(({ id }) => id !== this.productToDelete.id)
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Продукт успешно удален'
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

  resetProductHandler() {
    this.setState({
      mode: 'add',
      selected: JSON.parse(JSON.stringify(this.emptyProduct))
    });
  }

  updateField(field, value) {
    this.state.selected[field] = value;
    this.setState({ selected: this.state.selected });
  }

  removeRelatedProduct(product, e) {
    e.preventDefault();

    const selected = this.state.selected;
    selected.relatedProducts =
      selected.relatedProducts.filter(({ id }) => id !== product.id) ;

    this.setState({ selected });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Продукт</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="brandTitle">Название продукта *</label>
                <input
                  type="text"
                  class="form-control"
                  id="productTitle"
                  onChange={(e) => this.updateField('title', e.target.value)}
                  value={this.state.selected.title || ''}
                  placeholder="Введите название продукта"
                />
              </div>
              <div class="form-group">
                <label for="productDescription">Описание продукта *</label>
                <textarea
                  class="form-control"
                  id="productDescription"
                  onChange={(e) => this.updateField('description', e.target.value)}
                  value={this.state.selected.description || ''}
                  placeholder="Введите описание продукта"
                />
              </div>
              <div class="form-group">
                <label for="productCategories">Категории продукта *</label>
                <Select2
                  style={{ width: '100%' }}
                  nestedOffset="30"
                  placeholder="Выберите одну или несколько категорий"
                  onChange={(categories) => this.updateField('categories', categories)}
                  data={this.state.categories}
                  value={this.state.selected.categories}
                />
              </div>
              <div class="form-group">
                <label>Изображения продукта *</label>
                <div class="brand-pictures">
                  {
                    (this.state.selected.pictures || []).map((picture) => {
                      return (
                        <div
                          key={picture.id}
                          onClick={this.setProductPictureHandler.bind(this, picture)}
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
              <div class="form-group">
                <label for="isNovelty">Новинка</label>
                <br/>
                <Checkbox
                  id="isNovelty"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isNovelty}
                  onChange={(e) => this.updateField('isNovelty', !e.target.checked)}
                  />
              </div>
              <div class="form-group">
                <label for="isProductAuction">Продукт аукционный</label>
                <br/>
                <Checkbox
                  id="isProductAuction"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isAuction}
                  onChange={(e) => this.updateField('isAuction', !e.target.checked)}
                />
              </div>

              <div class="form-group">
                <label for="categoryDiscount">Скидка</label>
                <div class="input-group">
                  <Discount
                    id="categoryDiscount"
                    className="form-control"
                    discountLabels={[
                      { key: '',      value: 'Нет' },
                      { key: '%',     value: '%' },
                      { key: 'const', value: Settings.get('currencyCode') }
                    ]}
                    defaultValue={
                      {
                        key: this.state.selected.discountType,
                        value: this.state.selected.discount
                      }
                    }
                    onChange={({ discountType, discountValue: value }) => {
                      this.updateField('discount', value);
                      this.updateField('discountType', discountType);
                    }}
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="isAvailable">Есть в наличии</label>
                <br/>
                <Checkbox
                  id="isAvailable"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isAvailable}
                  onChange={(e) => this.updateField('isAvailable', !e.target.checked)}
                />
              </div>

              <div class="form-group">
                <label for="isAvailable">Связанные продукты</label>
                <div class="related-products">
                  {
                    this.state.selected.relatedProducts.map((relatedProduct) => {
                      return (
                        <div class="related media" key={relatedProduct.id}>
                          <div class="media-left">
                            <a href="#">
                              <img width="65" height="65" src="http://api.e-commerce.loc/uploads/2017-08-19 19.43.30.1.jpg" alt="" />
                            </a>
                          </div>
                          <div class="media-body">
                            <div class="clearfix">
                              <p class="pull-right">
                                <a href="#" onClick={this.removeRelatedProduct.bind(this, relatedProduct)} class="btn btn-info btn-sm fa fa-trash"></a>
                              </p>
                              <h4>Material Dashboard Pro ─ $59</h4>
                              <p>Angular 2 Premium Material Bootstrap Admin with a fresh, new design inspired by Google's Material Design</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  <div class="media brand-pictures">
                    <div class="brand-picture empty" onClick={this._uploadFiles.bind(this)} style={{ width:65, height:65, lineHeight: '63px' }}>+</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="box-footer">
              {
                (this.state.mode === 'add') ?
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateProductHandler.bind(this)}> Добавить</button> :
                  <div class="btn-group">
                    <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateProductHandler.bind(this)}> Сохранить</button>
                    <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetProductHandler.bind(this)}> Новый</button>
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
