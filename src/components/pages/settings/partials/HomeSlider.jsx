import React from 'react';
import ProductsList from '../../../widgets/ProductsList.jsx';
import SelectProductsDialog from '../../products/popups/RelativeProductsDialog.jsx';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import { get } from '../../../../actions/Products';
import { set } from '../../../../actions/Settings';

export default class HomeSlider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    JSON.parse(((this.props.settings || {}).homeSlider || '[]')).map((id) => {
      get(
        { id },
        (product) => {
          this.state.products.push(product);
          this.setState({ products: this.state.products });
        },
        (e) => console.error(e)
      );
    });
  }

  initDialogs() {
    this.selectProductsDialog =
      <SelectProductsDialog
        manageControll={['checkbox']}
        onSelectClick={this.addSlides.bind(this)}
        selected={this.state.products.map(({ id }) => id)}
        style={{ width:1200 }}
      />;
  }

  addSlides(slides) {
    dispatch('popup:close');

    this.saveData(
      this.state.products.concat(slides),
      () => {
        this.setState({ products: this.state.products.concat(slides) });
        dispatch('settings:sync');
      }
    );
  }

  saveData(slides, callback) {
    let data = slides.map(({ id }) => id);

    set(
      { key: 'homeSlider', data },
      callback,
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  addSlidesPopup() {
    dispatch('popup:show', {
      title: 'Отметьте продукты для отображения',
      body: this.selectProductsDialog
    });
  }

  render() {
    this.initDialogs();

    return (
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Товары на слайдере главной страницы</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-widget="collapse">
                <i class="fa fa-minus"></i>
              </button>
            </div>
        </div>
        <div class="box-body">

          <div class="related-products no-border no-padding">
            <ProductsList
              className="related-products no-border no-padding"
              products={this.state.products}
              manageControll={['trash']}
              onControllClick={(productId) => {
                this.saveData(
                  this.state.products.filter(({ id }) => id !== productId),
                  () => dispatch('settings:sync')
                );
              }}
            />
          </div>
          <div class="media pictures-list">
            <div class="picture empty" onClick={this.addSlidesPopup.bind(this)} style={{ width:60, height:60, lineHeight:'58px' }}>+</div>
          </div>
        </div>
      </div>
    );
  }
}
