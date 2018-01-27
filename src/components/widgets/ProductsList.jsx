import React from 'react';
import { Link } from 'react-router';
import { Checkbox } from 'react-icheck';
import { buildUrl } from '../../core/helpers/Utils';

export default class ProductsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      products: this.props.products || [],
    };
  }

  componentWillReceiveProps({ products }) {
    this.setState({ products });
  }

  onProductSelect(productId, controllType, e) {
    this.setState({
      products: this.state.products.map((product) => {
        if (product.id === productId) {
          product.selected = e.target.checked;
        }
        return product;
      })
    });
  }

  onProductDelete(productId, controllType, e) {
    this.setState(
      { products: this.state.products.filter(({ id }) => id !== productId) },
      () => this.props.onControllClick(productId, controllType, e)
    );
  }

  onChangeProductCount(product, controllType, e) {
    Object.assign(product, { count: Number(e.target.value) })
    this.setState(
      { products: this.state.products },
      () => this.props.onControllClick(product.id, controllType, e)
    );
  }


  _getControll(productId) {

    return (this.props.manageControll || []).map((controllType) => {
      let controll = null;

      switch (controllType) {
        case 'checkbox':
          controll =
            <Checkbox
              checkboxClass="icheckbox_square-blue"
              increaseArea="20%"
              onChange={this.onProductSelect.bind(this, productId, controllType)}
            />;
        break;

        case 'trash':
          controll =
            <div
              onClick={this.onProductDelete.bind(this, productId, controllType)}
              class="btn btn-sm btn-primary fa fa-trash"
            />;
        break;

        case 'number':
          const product = this.state.products.find(({ id }) => id === productId);

          controll =
            <input
              class="form-control input-sm"
              type="number"
              onChange={this.onChangeProductCount.bind(this, product, controllType)}
              defaultValue={product.count || 1}
              min="0"
              max="999"
              style={{ width:59 }}
            />;
        break;
      }

      return (
        <div class="pull-right" key={controllType.concat(productId)}>{controll}</div>
      );
    });
  }

  render() {
    return (
      <div class={this.props.className}>
        {
          this.state.products.length > 0 ?
            this.state.products.map(({ id, title, briefly, description, pictures, pictureId }) => {
              const picture = pictures.find(({ id }) => id === pictureId) || pictures[0];

              return (
                <div key={id} class="related media">
                  <div class="media-left">
                    <img src={buildUrl(picture)} alt={picture.name} />
                  </div>
                  <div class="media-body">
                    <div class="clearfix">
                      {this._getControll(id)}
                      <h4 style={{ marginTop:0 }}>
                        <Link target="_blank" to={`product/${id}`}>{title}</Link>
                      </h4>
                      <p>{briefly}</p>
                    </div>
                  </div>
                </div>
              );
            })
            :
            this.props.children
        }
      </div>
    );
  }
}
