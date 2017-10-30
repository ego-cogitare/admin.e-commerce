import React from 'react';
import { Link } from 'react-router';
import DeleteCategoryDialog from './popups/DeleteCategoryDialog.jsx';
import Settings from '../../../core/helpers/Settings';
import CategoriesTree from '../widgets/CategoriesTree.jsx';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { tree, get, add, update, remove } from '../../../actions/Category';

export default class Categories extends React.Component {

  constructor(props) {
    super(props);

    this.emptyCategory = {
      id: null,
      parrentId: null,
      title: '',
      description: '',
      isHidden: false,
      discount: 0,
      discountType: ''//Settings.get('currencyCode')
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected category
      selected: JSON.parse(JSON.stringify(this.emptyCategory)),

      // Categories list
      categories: [],

      discountType: this.getDiscountTypeLabel(),
    };
  }

  _expandModel(category) {
    return category;
  }

  _loadCategoryTree() {
    tree({},
      (categories) => this.setState({
        categories: [{
          id: "",
          title: '(Нет)',
          className: 'text-gray'
        }].concat(categories)
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
            discountType: this.getDiscountTypeLabel(r.discountType),
            mode: 'edit'
          });
          this.refs.categoryDiscount.disabled = !r.discountType;
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
    this.deleteСategoryDialog = <DeleteCategoryDialog onDeleteClick={this._deleteCategory.bind(this)} />;
  }

  selectCategoryHandler(selected) {
    this.setState({
      selected,
      discountType: this.getDiscountTypeLabel(selected.discountType),
      mode: 'edit'
    });
    this.refs.categoryDiscount.disabled = !selected.discountType;
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
      Object.assign(
        { ...this.state.selected },
        { parrentId: this.refs.categoryTree.selected.id }
      ),
      (r) => {
        this.state.selected.id = r.id;
        this.state.selected.parrentId = r.parrentId;
        this.setState({
            mode: 'edit',
            selected: this.state.selected,
            categories: this.state.categories.concat(this.state.selected)
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
    this.setState({
      mode: 'add',
      selected: JSON.parse(JSON.stringify(this.emptyCategory)),
      discountType: this.getDiscountTypeLabel('')
    });
    this.refs.categoryDiscount.disabled = true;
  }

  getDiscountTypeLabel(discountType) {
    return (!discountType) ? 'Нет' :
      (discountType !== '%') ? Settings.get('currencyCode') : '%';
  }

  categoryDiscountTypeChanged(discountType, e) {
    e.preventDefault();

    this.state.selected.discountType = discountType;
    this.setState({
      selected: this.state.selected,
      discountType: this.getDiscountTypeLabel(discountType)
    });
    this.refs.categoryDiscount.disabled = !discountType;
  }

  categoryDiscountChange(e) {
    this.state.selected.discount = e.target.value.replace(/[^\d\.]/g, '');
    this.setState({ selected: this.state.selected });
  }

  onCategorySelect(category) {
    if (category.id === "") {
      return this.resetCategoryHandler();
    }
    this.setState({
      selected: category,
      discountType: this.getDiscountTypeLabel(category.discountType),
      mode: 'edit'
    });
    this.refs.categoryDiscount.disabled = !category.discountType;
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
              <div class="form-group">
                <label>Дерево категорий</label>
                <CategoriesTree
                  ref="categoryTree"
                  className="form-control"
                  categories={this.state.categories}
                  size="12"
                  categoryIndent="15"
                  onSelect={this.onCategorySelect.bind(this)}
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
                  <input
                    type="text"
                    ref="categoryDiscount"
                    class="form-control"
                    id="categoryDiscount"
                    placeholder="0"
                    onChange={this.categoryDiscountChange.bind(this)}
                    value={this.state.selected.discount || ''}
                    style={{ width: 60 }}
                    disabled
                  />
                  <div class="input-group-btn pull-left">
                    <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">{ this.state.discountType }
                      <span class="fa fa-caret-down"></span>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a href="#" onClick={this.categoryDiscountTypeChanged.bind(this, '')}>Нет</a></li>
                      <li><a href="#" onClick={this.categoryDiscountTypeChanged.bind(this, '%')}>%</a></li>
                      <li><a href="#" onClick={this.categoryDiscountTypeChanged.bind(this, 'const')}>{ Settings.get('currencyCode') }</a></li>
                    </ul>
                  </div>
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
