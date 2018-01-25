import React from 'react';
import classNames from 'classnames';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { properties, addProperty, updateProperty, removeProperty } from '../../../actions/Products';

export default class Properties extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      properties: []
    };
  }

  fetchPropsList() {
    properties(
      {},
      (properties) => {
        properties.map((property) => {
          property.children.push({
            isNew: true,
            isChild: true,
            key: '',
            id: Date.now(),
            parentId: property.id
          })
        })
        properties.push({
          isNew: true,
          key: '',
          id: Date.now(),
          parentId: ''
        });
        this.setState({ properties });
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
      pageTitle: 'Редактирование свойств товара'
    });
    this.fetchPropsList();
  }

  onPropertyAdd(property, e) {
    e.preventDefault();

    addProperty(
      { ...property },
      (property) => {
        this.fetchPropsList();
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Свойство добавлено'
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

  onPropertySave(property, e) {
    e.preventDefault();

    updateProperty(
      { ...property },
      (property) => {
        this.fetchPropsList();
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Свойство обновлено'
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

  onPropertyDelete(property, e) {
    e.preventDefault();

    removeProperty(
      { ...property },
      (r) => {
        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Свойство удалено'
        });
        this.fetchPropsList();
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

  renderProperyRow(property) {
    property = { ...property };

    return (
      <div class="property-row" key={property.id}>
        <div class="form-group">
          <div class="input-group">
            { property.isChild && <div class="pull-left" style={{lineHeight:'28px', marginRight:4}}>-</div> }
            <div class={classNames('input-group', {'input-group-sm':property.isChild})}>
              <input
                type="text"
                class="form-control"
                placeholder={property.isNew ? 'Добавить новое свойство' : 'Введите название свойства'}
                defaultValue={property.key}
                onKeyDown={(e) => {
                  if (e.which === 13) {
                    property.isNew ? this.onPropertyAdd(property, e) : this.onPropertySave(property, e);
                  }
                }}
                onChange={(e) => Object.assign(property, { key: e.target.value })}
                style={{ width: property.isChild ? 180 : 250 }}
              />
              <div class="input-group-btn">
                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">
                  <span class="fa fa-caret-down"></span>
                </button>
                {
                  property.isNew ?
                    <ul class="dropdown-menu">
                      <li>
                        <a href="#" onClick={this.onPropertyAdd.bind(this, property)}>Добавить</a>
                      </li>
                    </ul> :
                    <ul class="dropdown-menu">
                      <li>
                        <a href="#" onClick={this.onPropertySave.bind(this, property)}>Сохранить</a>
                      </li>
                      <li>
                        <a href="#" onClick={this.onPropertyDelete.bind(this, property)}>Удалить</a>
                      </li>
                    </ul>
                }
              </div>
            </div>
          </div>
        </div>
        { (property.children || []).map((child) => this.renderProperyRow(Object.assign(child, { isChild: true }))) }
      </div>
    );
  }

  render() {
    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Свойства</h3>
            </div>
            <div class="box-body">
              {
                this.state.properties.length === 0 ?
                  <div class="text-center">Не добавлено ниодного свойства товара.</div> :
                  this.state.properties.map(
                    (property) => this.renderProperyRow(property)
                  )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
