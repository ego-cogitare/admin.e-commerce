import React from 'react';
import { Checkbox } from 'react-icheck';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import CategoriesTree from '../../widgets/CategoriesTree.jsx';
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

  onProductSelect(id, e) {
    this.setState({
      products: this.state.products.map((product) => {
        if (product.id === id) {
          product.selected = e.target.checked;
        }
        return product;
      })
    });
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
            <div class="related-products">
              {
                this.state.products.length > 0 ?
                  this.state.products.map(({ id, title, description, pictures, pictureId }) => {
                    const picture = pictures.find(({ id }) => id === pictureId) || pictures[0];

                    return (
                      <div key={id} class="related media colmd-6">
                        <div class="media-left">
                          <a href="#">
                            <img width="60" height="60" style={{ marginLeft:12 }} src={buildUrl(picture)} alt={picture.name} />
                          </a>
                        </div>
                        <div class="media-body">
                          <div class="clearfix">
                            <p class="pull-right">
                              <Checkbox
                                checkboxClass="icheckbox_square-blue"
                                increaseArea="20%"
                                onChange={this.onProductSelect.bind(this, id)}
                              />
                            </p>
                            <h4 style={{ marginTop:0 }}>{title}</h4>
                            <p>{description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  :
                  <div class="text-center">
                    Нет товаров для отображения
                  </div>
              }
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Отмена</button>
          <button
            type="button"
            class="btn btn-primary pull-right"
            onClick={() => this.props.onSelectClick(
              this.state.products.filter(({ selected }) => selected )
            )}>Выбрать</button>
        </div>
      </div>
    );
  }
}
