import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { Checkbox } from 'react-icheck';
import Settings from '../../../core/helpers/Settings';
import DeletePictureDialog from './popups/DeletePictureDialog.jsx';
import DeleteAwardDialog from './popups/DeleteAwardDialog.jsx';
import PicturesList from '../../widgets/PicturesList.jsx';
import ProductsList from '../../widgets/ProductsList.jsx';
import Select2 from '../../widgets/Select2.jsx';
import Discount from '../../widgets/Discount.jsx';
import FileDragAndDrop from 'react-file-drag-and-drop';
import FileUpload from 'react-fileupload';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import UploadAwardDialog from '../fileManager/popup/UploadFile.jsx';
import RelativeProductsDialog from './popups/RelativeProductsDialog.jsx';
import ProductPropertiesDialog from './popups/ProductPropertiesDialog.jsx';
import ProductReviewsDialog from './popups/ProductReviewsDialog.jsx';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { bootstrap, get, update, remove, addPicture, deletePicture, addAward, deleteAward } from '../../../actions/Products';
import { tree as categoryTree } from '../../../actions/Category';
import { list as brandList } from '../../../actions/Brand';
import { setApproved as setApprovedReviews } from '../../../actions/Review';

export default class Product extends React.Component {

  constructor(props) {
    super(props);

    this.emptyProduct = {
      id: '',
      title: '',
      briefly: '',
      description: '',
      brandId: '',
      categoryId: '',
      video: '',
      sku: '',
      pictures: [],
      awards: [],
      pictureId: '',
      relatedProducts: [],
      properties: [],
      isNovelty: false,
      isAuction: false,
      isBestseller: false,
      price: 0,
      discount: 0,
      discountType: '',
      discountTimeout: 0,
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

  initTextEditor() {
    $(this.refs.productDescription).trumbowyg(config.trumbowyg);
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
              this.initTextEditor();
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
      this.initTextEditor();
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

    this.uploadAwardDialog =
      <UploadAwardDialog
        path={this.state.path}
        onUploadSuccess={(file) => this.addProductAwardHandler(this.state.selected, file)}
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

    this.deletePictureDialog =
      <DeletePictureDialog
        onDeleteClick={this._doDeletePicture.bind(this)}
      />;

    this.deleteAwardDialog =
      <DeleteAwardDialog
        onDeleteClick={this._doDeleteAward.bind(this)}
      />;

    this.productPropertiesDialog =
      <ProductPropertiesDialog
        onSelectClick={this._doPropertiesUpdate.bind(this)}
        enabledList={this.state.selected.properties}
        style={{ width:1200 }}
      />;

    this.productReviewsDialog =
      <ProductReviewsDialog
        productId={this.props.params.id}
        onSelectClick={this._doReviewsUpdate.bind(this)}
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

  _selectProperties(e) {
    e.preventDefault();

    dispatch('popup:show', {
      title: 'Отметьте нужные параметры',
      body: this.productPropertiesDialog
    });
  }

  _viewReviews(e) {
    e.preventDefault();

    dispatch('popup:show', {
      title: 'Отзывы о продукте',
      body: this.productReviewsDialog
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

  _uploadAwards() {
    dispatch('popup:show', {
      title: 'Перетяните и бросьте файл для загрузки',
      body: this.uploadAwardDialog
    });
  }

  _deletePicture(picture) {
    this.pictureToDelete = picture;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deletePictureDialog
    });
  }

  _deleteAward(picture) {
    this.awardToDelete = picture;

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteAwardDialog
    });
  }

  _doPropertiesUpdate(properties) {
    dispatch('popup:close');
    this.updateField('properties', properties || []);
  }

  _doReviewsUpdate(reviews) {
    dispatch('popup:close');

    setApprovedReviews(
      {
        productId: this.props.params.id,
        reviewIds: reviews
      },
      (r) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Отзывы опубликованы'
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

  _doDeletePicture() {
    dispatch('popup:close');

    deletePicture(
      Object.assign(this.pictureToDelete, { productId: this.state.selected.id }),
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

  _doDeleteAward() {
    dispatch('popup:close');

    deleteAward(
      Object.assign(this.awardToDelete, { productId: this.state.selected.id }),
      (r) => {
        const selected = this.state.selected;

        // Delete brand picture from pictures list
        selected.awards = selected.awards.filter(
          ({ id }) => id !== this.awardToDelete.id
        );

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

  updateProductHandler(e) {
    e.preventDefault();

    const product = JSON.parse(JSON.stringify(this.state.selected));

    Object.assign(product, {
      pictures: product.pictures.map(({ id }) => id),
      awards: product.awards.map(({ id }) => id),
      relatedProducts: product.relatedProducts.map(({ id }) => id),
      description: this.refs.productDescription.innerHTML
    });

    update(
      product,
      (r) => {
        this.setState({
          selected: r,
          mode: 'edit'
        });

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

  addProductAwardHandler(product, picture) {
    addAward({ product, picture },
      (r) => {
        const selected = this.state.selected;
        selected.awards.push(picture);
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
                <label for="productTitle">Название товара *</label>
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
                <label for="productSku">Артикул *</label>
                <input
                  type="text"
                  class="form-control"
                  id="productSku"
                  onChange={(e) => this.updateField('sku', e.target.value)}
                  value={this.state.selected.sku || ''}
                  placeholder="Введите артикул товара"
                />
              </div>
              <div class="form-group">
                <label for="productVideo">Видеообзор товара</label>
                <input
                  type="text"
                  class="form-control"
                  id="productVideo"
                  onChange={(e) => this.updateField('video', e.target.value)}
                  value={this.state.selected.video || ''}
                  placeholder="Введите ссылку на обзор товара"
                />
              </div>

              <div class="form-group">
                <label for="productBriefly">Краткое описание *</label>
                <textarea
                  id="productBriefly"
                  class="form-control"
                  value={this.state.selected.briefly || ''}
                  onChange={(e) => {
                    this.state.selected.briefly = e.target.value;
                    this.setState({ selected: this.state.selected });
                  }}
                  placeholder="Введите краткое описание продукта"
                />
              </div>
              <div class="form-group">
                <label for="postBriefly">Полное описание *</label>
                <div
                  class="form-control"
                  ref="productDescription"
                  contentEditable="true"
                  dangerouslySetInnerHTML={{__html: this.state.selected.description || ''}}
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
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures || []}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setProductPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadFiles.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deletePicture.bind(this)}
                />
              </div>
              <div class="form-group">
                <label>Обозначения</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.awards || []}
                  activePictureId=""
                  onSelect={()=>false}
                  addPictureControll={true}
                  addPictureCallback={this._uploadAwards.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deleteAward.bind(this)}
                />
              </div>
              <div class="form-group">
                <div class="text-bold">Параметры продукта</div>
                <div class="btn btn-primary btn-sm" onClick={this._selectProperties.bind(this)}>
                  <i class="fa fa-pencil"></i>
                </div>
              </div>
              <div class="form-group">
                <div class="text-bold">Отзывы</div>
                <div class="btn btn-primary btn-sm" onClick={this._viewReviews.bind(this)}>
                  <i class="fa fa-pencil"></i>
                </div>
              </div>
              <div class="row">
                <div class="col-md-1 col-sm-6 col-xs-12">
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
                <div class="col-md-1 col-sm-6 col-xs-12">
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
                <div class="col-md-1 col-sm-6 col-xs-12">
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
                <br/><br/><br/>
              </div>
              <div class="form-group">
                <label for="productPrice">Цена *</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="productPrice"
                    onChange={(e) => this.updateField('price', e.target.value)}
                    value={this.state.selected.price || ''}
                    placeholder="0"
                    style={{ width: 60 }}
                  />
                  <div class="input-group-addon" style={{ width:'auto' }}>
                    <i>{Settings.get('currencyCode')}</i>
                  </div>
                </div>
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
                <label for="discountTimeout">Время действия скидки</label>
                <input
                  type="text"
                  class="form-control"
                  id="discountTimeout"
                  onChange={(e) => this.updateField('discountTimeout', e.target.value)}
                  value={this.state.selected.discountTimeout || ''}
                  placeholder="0"
                  style={{ width: 120 }}
                />
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
                <div class="media pictures-list">
                  <div class="picture empty" onClick={this._selectRelativeProducts.bind(this)} style={{ width:60, height:60, lineHeight:'58px' }}>+</div>
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
