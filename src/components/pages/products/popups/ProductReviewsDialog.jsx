import React from 'react';
import Moment from 'moment';
import { Checkbox } from 'react-icheck';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../../core/helpers/Utils';
import { reviews, update, remove } from '../../../../actions/Review';

export default class ProductReviewsDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
    };

    this.approvedList = [];
  }

  componentDidMount() {
    reviews(
      { productId: this.props.productId },
      (reviews) => {
        this.setState({ reviews });
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
    return (
      <div>
        <div class="modal-body" style={{padding:'0 15px'}}>
        {
          <ul class="products-list product-list-in-box">
          {
            this.state.reviews.map(({id, rate, userName, review, dateCreated, isApproved}) => {
              if (isApproved) {
                this.approvedList.push(id);
              }
              return (
                <li key={id} class="item">
                  <Checkbox
                    checkboxClass="icheckbox_square-blue pull-left"
                    increaseArea="20%"
                    defaultChecked={isApproved}
                    onChange={(e) => {
                      if (e.target.checked)
                        this.approvedList.indexOf(id) === -1 && this.approvedList.push(id);
                      else
                        this.approvedList = this.approvedList.filter((reviewId) => reviewId !== id);
                    }}
                    />
                  <div class="product-info" style={{marginLeft:36}}>
                    <a href="javascript:void(0)" class="product-title">{userName}
                      <span class="product-description">{Moment(dateCreated * 1000).format('DD.MM.YYYY HH:mm')} (Оценка: {rate})</span>
                      <br/>
                      <span class="product-description" style={{whiteSpace:'initial'}}>
                        {review}
                      </span>
                    </a>
                  </div>
                </li>
              );
            })
          }
          </ul>
        }
        </div>
        <div class="modal-footer">
          <small class="pull-left text-green"><br/>Отмеченные отзывы будут отображены на сайте.</small>
          <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Отмена</button>
          <button
            type="button"
            class="btn btn-primary pull-right"
            onClick={() => {
              this.props.onSelectClick(this.approvedList);
            }
          }>Сохранить</button>
        </div>
      </div>
    );
  }
}
