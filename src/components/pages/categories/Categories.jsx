import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Tree from 'react-ui-tree';
import 'react-ui-tree/dist/react-ui-tree.css';
import DeleteCategoryDialog from './popups/DeleteCategoryDialog.jsx';
import DeletePictureDialog from './popups/DeletePictureDialog.jsx';
import PicturesList from '../../widgets/PicturesList.jsx';
import UploadFileDialog from '../fileManager/popup/UploadFile.jsx';
import Settings from '../../../core/helpers/Settings';
import CategoriesTree from '../../widgets/CategoriesTree.jsx';
import Discount from '../../widgets/Discount.jsx';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { bootstrap, tree, treeUpdate, get, add, update, remove, addPicture, deletePicture } from '../../../actions/Category';

export default class Categories extends React.Component {

  constructor(props) {
    super(props);

    this.categoryOrder = 0;

    this.emptyCategory = {
      id: null,
      parrentId: null,
      pictures: [],
      pictureId: null,
      title: '',
      description: '',
      isHidden: false,
      discount: 0,
      discountType: ''
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected category
      selected: JSON.parse(JSON.stringify(this.emptyCategory)),

      // Categories list
      categories: {},
    };
  }

  _expandModel(category) {
    return category;
  }

  _loadCategoryTree() {
    tree(
      {},
      (categories) => this.setState({
        categories: Object.assign(
          JSON.parse(JSON.stringify(this.emptyCategory)),
          {
            id: '',
            module: ' (Корневая)',
            className: 'fa fa-home',
            children: categories
          }
        )
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
      pageTitle: 'Управление категориями'
    });

    // Get categories list
    this._loadCategoryTree();

    if (this.props.params.id) {
      get({ id: this.props.params.id },
        (r) => {
          this.setState({
            selected: this._expandModel(r),
            mode: 'edit'
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
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deleteСategoryDialog =
      <DeleteCategoryDialog
        onDeleteClick={this._deleteCategory.bind(this)}
      />;

    this.uploadFileDialog =
      <UploadFileDialog
        path={config.staticFiles}
        onUploadSuccess={(file) => this.addCategoryPictureHandler(this.state.selected, file)}
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

  addCategoryPictureHandler(category, picture) {
    console.log(category, picture);
    return ;
    addPicture({ category, picture },
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

  selectCategoryHandler(selected) {
    this.setState({
      selected,
      mode: 'edit'
    });
  }

  categoryTitleChange(e) {
    this.state.selected.title = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  categoryDescriptionChange(e) {
    this.state.selected.description = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  _addCategory(onSuccess = ()=>null, onFail = ()=>null) {
    this.state.selected.title = this.refs.categoryTitle.value;
    this.state.selected.description = this.refs.categoryDescription.value;

    add(
      { ...this.state.selected },
      (r) => {
        this.state.selected.id = r.id;
        // this.state.selected.parrentId = r.parrentId;
        this.setState({
            mode: 'edit',
            selected: this.state.selected,
            // categories: this.state.categories.concat(this.state.selected)
          },
          () => onSuccess(r)
        );
      },
      onFail
    );
  }

  addCategoryHandler(e) {
    e.preventDefault();

    this._addCategory(
      (category) => {
        // Update category tree
        this._loadCategoryTree();

        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Категория успешно добавлена'
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

  setCategoryPictureHandler({ id }, e) {
    this.state.selected.pictureId = id;
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

  updateCategoryHandler(e) {
    e.preventDefault();

    update({ ...this.state.selected },
      (category) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Категория успешно обновлена'
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

  deleteCategoryHandler(e) {
    e.preventDefault();

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteСategoryDialog
    });
  }

  _deleteCategory() {
    dispatch('popup:close');

    remove(this.state.selected,
      (r) => {
        // Update category tree
        this._loadCategoryTree();

        // Reset selected category
        this.setState({ selected: JSON.parse(JSON.stringify(this.emptyCategory)) });

        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Категория успешно удалена'
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

  isCategoryHiddenChange(e) {
    this.state.selected.isHidden = !e.target.checked;
    this.setState({ selected: this.state.selected });
  }

  resetCategoryHandler() {
    const leaf = Object.assign(
      JSON.parse(JSON.stringify(this.emptyCategory)),
      {
        module: 'Новая категория',
        title: 'Новая категория',
        className: 'font-italic text-gray',
        parrentId: this.state.selected.id
      }
    );

    this.state.selected.children.push(leaf);

    this.setState({
      mode: 'add',
      selected: leaf
    });
  }

  onBranchSelect(branch) {
    if (branch.id === "") {
      // return this.resetCategoryHandler();
    }
    this.setState({ selected: branch, mode: 'edit' });
  }

  renderNode(node) {
    return (
      <div
        class={classNames({ active: node === this.state.selected }, node.className )}
        onClick={this.onBranchSelect.bind(this, node)}
      >
        {node.module}
      </div>
    );
  }

  normalizeBranch(tree, parrentId) {
    if (tree.children.length > 0) {
      tree.children.map(
        (branch) => {
          return ((tree) => {
            Object.assign(branch, { parrentId: tree.id, order: this.categoryOrder++ });
            this.normalizeBranch(branch, tree);
          })(tree);
        }
      );
    }
  }

  handleChange(tree) {
    // Normalize parrent ids
    this.normalizeBranch(tree, null);

    console.log('tree', tree);

    treeUpdate(
      { tree: JSON.stringify(tree) },
      (tree) => {},
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
              <h3 class="box-title">Категории</h3>
            </div>
            <div class="box-body">
              <div class="form-group category-tree">
                <label>Дерево категорий</label>
                <Tree
                  paddingLeft={20}
                  tree={this.state.categories}
                  onChange={this.handleChange.bind(this)}
                  renderNode={this.renderNode.bind(this)}
                />
              </div>
              <div class="form-group">
                <label for="categoryTitle">Название категории *</label>
                <input
                  type="text"
                  ref="categoryTitle"
                  class="form-control"
                  id="categoryTitle"
                  onChange={this.categoryTitleChange.bind(this)}
                  value={this.state.selected.title || ''}
                  placeholder="Введите название категории"
                />
              </div>
              <div class="form-group">
                <label for="categoryDescription">Описание категории</label>
                <textarea
                  ref="categoryDescription"
                  class="form-control"
                  id="categoryDescription"
                  onChange={this.categoryDescriptionChange.bind(this)}
                  value={this.state.selected.description || ''}
                  placeholder="Введите описание категории"
                />
              </div>
              <div class="form-group">
                <label>Изображение категории *</label>
                <PicturesList
                  className="pictures-list"
                  pictureClassName="picture"
                  pictureActiveClassName="selected"
                  pictures={this.state.selected.pictures}
                  activePictureId={this.state.selected.pictureId}
                  onSelect={this.setCategoryPictureHandler.bind(this)}
                  addPictureControll={true}
                  addPictureCallback={this._uploadFiles.bind(this)}
                  deletePictureControll={true}
                  deletePictureCallback={this._deletePicture.bind(this)}
                />
              </div>
              <div class="form-group">
                <label for="isCategoryHidden">Категория скрыта</label>
                <br/>
                <Checkbox
                  id="isCategoryHidden"
                  checkboxClass="icheckbox_square-blue"
                  increaseArea="20%"
                  checked={this.state.selected.isHidden}
                  onChange={this.isCategoryHiddenChange.bind(this)}
                />
                <span class="help-block">Если включено, то все товары данной категории и ее подкатегорий не будут отображены на сайте.</span>
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
                    onChange={({ discountType, discountValue }) => {
                      this.state.selected.discount = discountValue;
                      this.state.selected.discountType = discountType;
                      this.setState({ selected: this.state.selected });
                    }}
                  />
                </div>
                <span class="help-block">Скидка распространяется на все товары и подкатегории данной категории.
                  Если у подкатегории или товара задана своя скидка, то значение скидки будет взято с конфигурации
                  подкатегории или отдельного товара.</span>
              </div>
            </div>
            <div class="box-footer">
              {
                (this.state.mode === 'add') ?
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addCategoryHandler.bind(this)}> Добавить</button> :
                  <div class="btn-group">
                    <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateCategoryHandler.bind(this)}> Сохранить</button>
                    <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetCategoryHandler.bind(this)}> Новая</button>
                    <button type="submit" class="btn btn-danger fa fa-trash" onClick={this.deleteCategoryHandler.bind(this)}> Удалить</button>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
