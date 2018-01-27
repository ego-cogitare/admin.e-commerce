import React from 'react';
import { Radio, RadioGroup } from 'react-icheck';
import classNames from 'classnames';

export default class Items extends React.Component {

  constructor(props) {
    super(props);

    this.emptyItem = {
      isNew: true,
      title: ''
    };

    this.state = {
      items: []
    };
  }

  componentWillReceiveProps({items}) {
    this.setState({
      items: items.concat([{...this.emptyItem, id: Date.now()}]) 
    });
  }

  onItemAdd(item) {
    if (item.title === '') {
      return false;
    }
    Object.assign(item, { isNew: false });
    this.state.items.push({...this.emptyItem, id: Date.now()});
    this.setState({ items: this.state.items });
  }

  onItemDelete(item) {
    return false;
    this.setState({ items: this.state.items.filter(({id}) => id !== item.id) });
  }

  render() {
    return (
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">{this.props.title}</h3>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
            </div>
        </div>
        <div class="box-body">
          <div class="form-group no-margin">
            {
              this.state.items.map((item) => (
                <div key={item.id} class='input-group' style={{marginBottom:5}}>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Название способа оплаты"
                    defaultValue={item.title}
                    onKeyDown={(e) => e.which === 13 && item.isNew && this.onItemAdd(item, e)}
                    onChange={(e) => Object.assign(item, { title: e.target.value })}
                  />
                  <div class="input-group-btn">
                    <button
                      type="button"
                      class={classNames('btn', {'btn-info':item.isNew, 'flat btnsuccess':!item.isNew})}
                      /*onClick={item.isNew ? this.onItemAdd.bind(this, item) : this.onItemDelete.bind(this, item)}*/
                      onClick={item.isNew && this.onItemAdd.bind(this, item)}
                    >
                      <span class={classNames('fa', { 'fa-check': !item.isNew, 'fa-plus': item.isNew })}></span>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div class="box-footer">
          <button
            type="submit"
            class="btn btn-primary fa fa-check"
            onClick={() => this.props.onSave(this.state.items.filter(({isNew}) => !isNew))}
          >Сохранить</button>
        </div>
      </div>
    );
  }
}
