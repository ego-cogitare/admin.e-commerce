import React from 'react';
import { Link } from 'react-router';
import Moment from 'moment';
import PowerTable from '../../widgets/PowerTable.jsx';
import DeleteProductDialog from './popups/DeleteProductDialog.jsx';
import { buildUrl } from '../../../core/helpers/Utils';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { list, remove } from '../../../actions/Products';
import { tree as categoryTree } from '../../../actions/Category';
import { list as brandList } from '../../../actions/Brand';

export default class Products extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Products list
      products: [],

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

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление товарами'
    });

    this.fetchCategories();
    this.fetchBrands();

    // Get products list
    list({},
      (products) => this.setState({ products }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
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
    this.deleteProductDialog = <DeleteProductDialog onDeleteClick={this._deleteProduct.bind(this)} />;
  }

  get columns() {
    return [
      { name: 'picture', width: 5, display: 'Фото', sort: false, style: { verticalAlign: 'middle', textAlign: 'center' }, renderer: (row) => {
        if (!row.pictureId) { return null; }
        return (
          <img
            width="80"
            src={buildUrl(row.picture)}
            style={{ objectFit: 'cover' }}
          />
        );
      } },
      { name: 'title', display: 'Товар' },
      { name: 'dateCreated', display: 'Добавлен', sort: true, renderer: ({ dateCreated }) => {
        return Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm');
      } },
      { name: 'edit', display: 'Править', width: 10, sort: false, renderer: ({ id }) => (
          <Link to={`product/${id}`}>
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

    remove(
      { id: this.productToDelete.id },
      (r) => {
        this.setState({
          products: this.state.products.filter(({ id }) => id !== this.productToDelete.id)
        });
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Товар успешно удален'
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

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Список товаров</h3>
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
                      <div class="text-center">Список товаров пуст</div>
                  </PowerTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
