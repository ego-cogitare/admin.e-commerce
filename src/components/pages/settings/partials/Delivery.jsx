import React from 'react';
import { Radio, RadioGroup } from 'react-icheck';

export default class Delivery extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Способы доставки</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="form-group">

          </div>
        </div>
        <div class="box-footer">
          <button type="submit" class="btn btn-primary fa fa-check" onClick={() => this.props.onSave(this.state)}>Сохранить</button>
        </div>
      </div>
    );
  }
}
