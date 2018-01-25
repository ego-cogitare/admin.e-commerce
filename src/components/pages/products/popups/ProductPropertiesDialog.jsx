import React from 'react';
import { Checkbox } from 'react-icheck';
import { dispatch } from '../../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../../core/helpers/Utils';
import { properties } from '../../../../actions/Products';

export default class ProductPropertiesDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      properties: [],
      enabledList: this.props.enabledList || []
    };
  }

  componentDidMount() {
    properties(
      {},
      (properties) => {
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

  render() {
    return (
      <div style={{overflow:'hidden'}}>
        <div class="modal-body row">
          {
            this.state.properties.map((property) => (
              <div key={property.id} class="col-sm-6 col-xs-12">
                <div class="text-bold">{property.key}</div>
                {
                  property.children.map(({ id, key }) => (
                    <div key={id} class="form-group no-margin">
                      <Checkbox
                        checkboxClass="icheckbox_square-blue"
                        increaseArea="20%"
                        defaultChecked={this.state.enabledList.indexOf(id) !== -1}
                        onChange={(e) => {
                          this.state.enabledList = e.target.checked
                            ? this.state.enabledList.concat([id])
                            : this.state.enabledList.filter((p) => p !== id);
                          this.setState({ enabledList: this.state.enabledList });
                        }}
                      />
                    <span style={{ marginLeft: 5 }}>{key}</span>
                    </div>
                  ))
                }
                <br/>
              </div>
            ))
          }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" onClick={() => dispatch('popup:close')}>Отмена</button>
          <button
            type="button"
            class="btn btn-primary pull-right"
            onClick={() => {
              this.props.onSelectClick(this.state.enabledList);
            }
          }>Выбрать</button>
        </div>
      </div>
    );
  }
}
