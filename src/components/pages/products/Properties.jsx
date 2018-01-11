import React from 'react';
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
    properties({},
      (properties) => this.setState({ properties }),
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

  onPropertyAdd() {
    this.state.properties.push({ id: Date.now(), key: '', isNew: true });
    this.setState({ properties: this.state.properties });
  }

  onPropertySave(property) {
    Object.assign(property, { key: this.refs[property.id].value });

    (property.isNew ? addProperty : updateProperty)(
      { ...property },
      (prop) => {
        const properties = this.state.properties.map((p) => {
          return p.id === property.id ? Object.assign(p, prop, { isNew: false }) : p;
        });
        this.setState(
          { properties },
          () => {
            dispatch('notification:throw', {
              type: 'success',
              title: 'Успех',
              message: 'Свойство сохранено'
            });
          }
        );
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

  onPropertyDelete(property) {
    removeProperty(
      { ...property },
      (r) => {
        dispatch('notification:throw', {
          type: 'success',
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
    return (
      <div class="row" key={property.id}>
        <div class="col-md-6">
          <div class="form-group">
            <div class="row">
              <div class="col-md-10">
                <input
                  ref={property.id}
                  type="text"
                  class="form-control"
                  placeholder="Введите название свойства"
                  defaultValue={property.key}
                />
              </div>
              <div class="col-md-1">
                <i class="fa fa-save btn btn-primary" onClick={this.onPropertySave.bind(this, property)}></i>
              </div>
              <div class="col-md-1">
                <i class="fa fa-trash btn btn-danger" onClick={this.onPropertyDelete.bind(this, property)}></i>
              </div>
            </div>
          </div>
        </div>
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
                  (property) => this.renderProperyRow(
                    property,
                    (id) => console.log(id),
                    (id) => console.log(id)
                  )
                )
            }
            </div>
            <div class="box-footer">
              <button type="submit" class="btn btn-primary fa fa-check" onClick={this.onPropertyAdd.bind(this)}> Добавить</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
