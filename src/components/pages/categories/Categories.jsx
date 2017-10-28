import React from 'react';
import { Link } from 'react-router';
import BootstrapTable from 'reactjs-bootstrap-table';
import DeleteCategoryDialog from './popups/DeleteCategoryDialog.jsx';
import Settings from '../../../core/helpers/Settings';
import CategoriesTree from '../widgets/CategoriesTree.jsx';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { list, get, add, update, remove } from '../../../actions/Category';

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
      discountType: Settings.get('currencyCode')
    };

    this.categoriesList = [
      {
        id: null,
        title: '(Нет)',
        className: "text-muted"
      },
      {
        id: 1,
        title: 'Категория №1',
        categories: [
          {
            id: 11,
            title: 'Категория №1.1',
          },
          {
            id: 12,
            title: 'Категория №1.2',
            categories: [
              {
                id: 121,
                title: 'Категория №1.2.1',
                categories: [
                  {
                    id: 1211,
                    title: 'Категория №1.2.1.1',
                  }
                ]
              },
              {
                id: 122,
                title: 'Категория №1.2.2',
              },
            ]
          },
          {
            id: 13,
            title: 'Категория №1.3',
          },
        ]
      },
      {
        id: 2,
        title: 'Категория №2',
      },
      {
        id: 3,
        title: 'Категория №3',
      },
    ];

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected category
      selected: JSON.parse(JSON.stringify(this.emptyCategory)),

      // Categories list
      categories: [],

      discountType: this.getDiscountTypeLabel()
    };
  }

  _expandModel(category) {
    return category;
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление категориями'
    });

    // Get categories list
    list({ limit: 10, offset: 0 },
      (categories) => {
        this.setState({ categories });
        this.categories = categories;
      },
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

  get columns() {
    return [
      { name: 'title', display: 'Категория', sort: true },
      { name: 'description', display: 'Описание', sort: true },
      { name: 'edit', display: 'Править', sort: false, width: 10, renderer: (row) => {
        return <Link to={"categories/" + row.id} onClick={this.selectCategoryHandler.bind(this, row)}><span class="fa fa-edit"></span></Link>;
      } },
      { name: 'remove', display: 'Удалить', sort: false, width: 10, renderer: (row) => {
        return <a href="#" onClick={this.deleteCategoryHandler.bind(this, row)}><span class="fa fa-trash"></span></a>;
      } },
    ];
  }

  onSort(colName, dir) {
    switch (dir) {
      case 'asc':
        this.setState({ brands: this.state.categories.sort((a, b) => a[colName] > b[colName] ? 1 : -1 ) });
      break;

      case 'desc':
        this.setState({ brands: this.state.categories.sort((a, b) => b[colName] > a[colName] ? 1 : -1 ) });
      break;

      default:
        this.setState({ brands: this.state.categories });
      break;
    }
  }

  onChange(selection) {
    // this.setState({
    //   selected: Object.values(selection)[0]
    // });
  }

  filterChangeHandler(e) {
    this.setState({ categories: this.categories.filter((category) => {
        return category.title.toLowerCase().match(e.target.value.toLowerCase());
      })
    });
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

    add({ ...this.state.selected },
      (r) => {
        this.state.selected.id = r.id;
        this.setState({
            mode: 'edit',
            selected: this.state.selected,
            categories: this.state.categories.concat(this.state.selected)
          },
          () => {
            this.categories = this.state.categories;
            onSuccess(r);
          }
        );
      },
      onFail
    );
  }

  addCategoryHandler(e) {
    e.preventDefault();

    this._addCategory(
      (category) => {
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

  deleteCategoryHandler(category, e) {
    e.preventDefault();

    this.categoryToDelete = category;
    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteСategoryDialog
    });
  }

  _deleteCategory() {
    dispatch('popup:close');

    remove(this.categoryToDelete,
      (r) => {
        this.setState({
          categories: this.state.categories.filter(({id}) => id !== this.categoryToDelete.id)
        });
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
      selected: JSON.parse(JSON.stringify(this.emptyCategory))
    });
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
    console.log(category);
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Добавить новую категорию</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label>Родительская категория</label>
                <CategoriesTree
                  className="form-control"
                  categories={this.categoriesList}
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
                <span class="help-block">Если включено, то все товары данной категории не будут отображены на сайте.</span>
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
                <span class="help-block">Если задана, то скидка распространяется на все товары данной категории.</span>
              </div>
            </div>
            <div class="box-footer">
              {
                (this.state.mode === 'add') ?
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addCategoryHandler.bind(this)}> Добавить</button> :
                  <div class="btn-group">
                    <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateCategoryHandler.bind(this)}> Сохранить</button>
                    <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetCategoryHandler.bind(this)}> Новая</button>
                  </div>
              }
            </div>
          </div>

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список категорий</h3>
            </div>
            <div class="box-body data-table-container">
              <div class="row">
                <div class="col-lg-3 pull-right" style={{ marginBottom: '10px' }}>
                  <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                    <input type="text" class="form-control" defaultValue="" onChange={this.filterChangeHandler.bind(this)} placeholder="Фильтр" />
                  </div>
                </div>
              </div>
              <BootstrapTable
                columns={this.columns}
                data={this.state.categories}
                headers={true}
                resize={true}
                select="single"
                selected={this.state.selection}
                onSort={this.onSort.bind(this)}
                onChange={this.onChange.bind(this)}
              >
                <div class="text-center">Список категорий пуст.</div>
              </BootstrapTable>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
