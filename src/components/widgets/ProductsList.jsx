import React from 'react';
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

  onProductSelect(productId, e) {
    this.setState({
      products: this.state.products.map((product) => {
        if (product.id === productId) {
          product.selected = e.target.checked;
        }
        return product;
      })
    });
  }

  onProductDelete(productId, e) {
    this.setState({
      products: this.state.products.filter(({ id }) => id !== productId)
    });
    this.props.onControllClick(productId, e);
  }

  _getControll(productId) {
    switch (this.props.manageControll) {
      case 'checkbox':
        return (
          <Checkbox
            checkboxClass="icheckbox_square-blue"
            increaseArea="20%"
            onChange={this.onProductSelect.bind(this, productId)}
          />
        );
      break;

      case 'trash':
        return (
          <div
            onClick={this.onProductDelete.bind(this, productId)}
            class="btn btn-sm btn-primary fa fa-trash"
          />
        );
      break;

      default:
        return null;
      break;
    }
  }

  render() {
    return (
      <div class={this.props.className}>
        {
          this.state.products.length > 0 ?
            this.state.products.map(({ id, title, description, pictures, pictureId }) => {
              const picture = pictures.find(({ id }) => id === pictureId) || pictures[0];

              return (
                <div key={id} class="related media">
                  <div class="media-left">
                    <img src={buildUrl(picture)} alt={picture.name} />
                  </div>
                  <div class="media-body">
                    <div class="clearfix">
                      <div class="pull-right">
                        {this._getControll(id)}
                      </div>
                      <h4 style={{ marginTop:0 }}>{title}</h4>
                      <p>{description}</p>
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
