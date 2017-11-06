import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { Checkbox } from 'react-icheck';
import Settings from '../../../core/helpers/Settings';
import PicturesList from '../../widgets/PicturesList.jsx';
import ProductsList from '../../widgets/ProductsList.jsx';
import Select2 from '../../widgets/Select2.jsx';
import Discount from '../../widgets/Discount.jsx';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import RelativeProductsDialog from './popups/RelativeProductsDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { bootstrap, get, update, remove, addPicture } from '../../../actions/Products';
import { tree as categoryTree } from '../../../actions/Category';
import { list as brandList } from '../../../actions/Brand';

export default class Product extends React.Component {

  constructor(props) {
    super(props);

    this.emptyProduct = {
      id: '',
      title: '',
      description: '',
      brandId: '',
      categoryId: '',
      pictures: [],
      pictureId: '',
      relatedProducts: [],
      isNovelty: false,
      isAuction: false,
      isBestseller: false,
      discount: 0,
      discountType: '',
      isAvailable: true,
      availableAmount: -1
    };

    this.state = {
      // Current product form mode
      mode: this.props.params.id ? 'edit' : 'add',

      // Path to upload brand pictures
      path: config.staticFiles,

      // Current selected brand
      selected: JSON.parse(JSON.stringify(this.emptyProduct)),

      // Список категорий
      categories: [],

      // Список брэндов
      brands: []
    };
  }

  fetchCategories() {
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
  }

  fetchBrands() {
    brandList({},
      (brands) => {
        this.setState({
          brands: brands.map((brand) => Object.assign(brand, { text: brand.title }))
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

  getBootstrapProduct() {
    bootstrap(
      (bootstrap) => {
        this.setState(
          { selected: bootstrap, mode: 'add' },
          () => {
            this.fetchCategories();
            this.fetchBrands();
            browserHistory.push(`#/product/${bootstrap.id}`);
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

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Редактирование товара'
    });

    // Edit mode
    if (this.props.params.id) {
      get({ id: this.props.params.id },
        (r) => {
          this.setState(
            { selected: r, mode: 'edit' },
            () => {
              this.fetchCategories();
              this.fetchBrands();
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
    // Get bootstrap product
    else
    {
      this.getBootstrapProduct();
    }
  }

  categoryBranch(category, branch = [], depth = 0) {
    branch.push({
      id: category.id,
      title: category.title,
      text: category.title,
      level: depth
    });

    if (!category.children) {
      return branch;
    }

    category.children.forEach(
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

    this.relativeProductsDialog =
      <RelativeProductsDialog
        manageControll={['checkbox']}
        onSelectClick={this._setRelativeProducts.bind(this)}
        selected={this.state.selected.relatedProducts.map(({ id }) => id).concat([this.state.selected.id])}
        style={{ width:1200 }}
      />;
  }

  _selectRelativeProducts() {
    dispatch('popup:show', {
      title: 'Отметьте связанные товары',
      body: this.relativeProductsDialog
    });
  }

  _setRelativeProducts(products) {
    const selected = this.state.selected;
    selected.relatedProducts = selected.relatedProducts.concat(products);

    this.setState({ selected }, () => dispatch('popup:close'));
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

    const product = JSON.parse(JSON.stringify(this.state.selected));
    product.pictures = product.pictures.map(({ id }) => id);
    product.relatedProducts = product.relatedProducts.map(({ id }) => id);

    update(product,
      (r) => {
        this.setState({ selected: r, mode: 'edit' });

        if (product.type !== 'final') {
          this.setState({ products: this.state.products.concat(r) });
        }
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Товар успешно сохранён'
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

  addProductPictureHandler(product, picture) {
    addPicture({ product, picture },
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

  setProductPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
    this.setState({ selected: this.state.selected });
  }

  updateField(field, value) {
    this.state.selected[field] = value;
    this.setState({ selected: this.state.selected });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Товар</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="brandTitle">Название товара *</label>
                <input
                  type="text"
                  class="form-control"
                  id="productTitle"
                  onChange={(e) => this.updateField('title', e.target.value)}
                  value={this.state.selected.title || ''}
                  placeholder="Введите название товара"
                />
              </div>
              <div class="form-group">
                <label for="productDescription">Описание товара *</label>
                <textarea
                  class="form-control"
                  id="productDescription"
                  onChange={(e) => this.updateField('description', e.target.value)}
                  value={this.state.selected.description || ''}
                  placeholder="Введите описание товара"
                />
              </div>
              <div class="form-group">
                <label for="productBrand">Брэнд *</label>
                <Select2
                  style={{ width: '100%' }}
                  nestedOffset="0"
                  multiple={false}
                  placeholder="Укажите брэнд"
                  onChange={(brandId) => {
                    this.updateField('brandId', brandId);
                  }}
                  data={this.state.brands}
                  value={[ this.state.selected.brandId ]}
                />
              </div>
              <div class="form-group">
                <label for="productCategory">Категория товара *</label>
                <Select2
                  style={{ width: '100%' }}
                  nestedOffset="30"
                  multiple={false}
                  placeholder="Выберите одну или несколько категорий"
                  onChange={(categoryId) => {
                    this.updateField('categoryId', categoryId);
                  }}
                  data={this.state.categories}
                  value={[ this.state.selected.categoryId ]}
                />
              </div>
              <div class="form-group">
                <label>Изображения товара *</label>
                <PicturesList
                  className="brand-pictures"
                  pictureClassName="brand-picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setProductPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadFiles.bind(this)}
                />
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
                <label for="isProductAuction">Акция</label>
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
                <label for="isProductBestseller">Бестселлер</label>
                <br/>
                <Checkbox
                  id="isProductBestseller"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isBestseller}
                  onChange={(e) => this.updateField('isBestseller', !e.target.checked)}
                />
              </div>

              <div class="form-group">
                <label for="productDiscount">Скидка</label>
                <div class="input-group">
                  <Discount
                    id="productDiscount"
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
                <label for="isAvailable">С этим товаром покупают</label>
                <div class="related-products no-border no-padding">
                  <ProductsList
                    className="related-products no-border no-padding"
                    products={this.state.selected.relatedProducts}
                    manageControll={['trash']}
                    onControllClick={(productId) => {
                      const selected = this.state.selected;
                      selected.relatedProducts = selected.relatedProducts.filter(({ id }) => id !== productId);
                      this.setState({ selected });
                    }}
                  />
                </div>
                <div class="media brand-pictures">
                  <div class="brand-picture empty" onClick={this._selectRelativeProducts.bind(this)} style={{ width:60, height:60, lineHeight:'58px' }}>+</div>
                </div>
              </div>
            </div>
            <div class="box-footer">
              {
                (this.state.mode === 'add') ?
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateProductHandler.bind(this)}> Добавить</button> :
                  <div class="btn-group">
                    <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateProductHandler.bind(this)}> Сохранить</button>
                    <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.getBootstrapProduct.bind(this)}> Новый</button>
                  </div>
              }
            </div>
          </div>

        </div>
      </div>
    );
  }
}
