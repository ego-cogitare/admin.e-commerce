import React from 'react';
import { Checkbox } from 'react-icheck';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import CategoriesTree from '../../../widgets/CategoriesTree.jsx';
import ProductsList from '../../../widgets/ProductsList.jsx';
import { tree } from '../../../../actions/Category';
import { list } from '../../../../actions/Products';
import { buildUrl } from '../../../../core/helpers/Utils';

export default class RelativeProductsDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      products: [],
    };
  }

  componentDidMount() {
    tree({},
      (categories) => this.setState({ categories }),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  onCategorySelect(categories) {
    list({ filter: {
        categories: {
          '$in': categories.map(({ id }) => id)
        }
      }},
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

  render() {
    return (
      <div>
        <div class="modal-body">
          <div class="form-group">
            <label>Товары отдельной категории</label>
            <CategoriesTree
              multiple={true}
              ref="categoryTree"
              className="form-control"
              categories={this.state.categories}
              size="12"
              categoryIndent="15"
              onSelect={this.onCategorySelect.bind(this)}
            />
            <span class="help-block">* зажмите клавишу Сntrl для выбора нескольких категорий.</span>
          </div>

          <div class="form-group">
            <label>Продукты категории(й) ({this.state.products.length} шт.)</label>
            <ProductsList
              className="related-products no-border no-padding"
              products={this.state.products}
              manageControll="checkbox"
            >
              <div class="text-center">Категория не содержит товаров</div>
            </ProductsList>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Отмена</button>
          <button
            type="button"
            class="btn btn-primary pull-right"
            onClick={() => {
              this.props.onSelectClick(
                this.state.products.filter(({ selected }) => selected )
              );
            }
          }>Выбрать</button>
        </div>
      </div>
    );
  }
}
