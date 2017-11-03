import React from 'react';
import { dispatch } from '../../../core/helpers/EventEmitter';

export default class StaticPages extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',

      // Current selected page
      selected: {},

      // Pages list
      pages: [],
    };
  }

  componentDidMount() {
    dispatch('page:titles:change', {
      pageTitle: 'Управление статическими страницами'
    });

    $(this.refs.editor).trumbowyg();
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    // this.deletePageDialog = <DeletePageDialog onDeleteClick={this._deletePage.bind(this)} />;
  }

  addPageHandler() {

  }

  updatePageHandler() {

  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Статические страницы</h3>
            </div>
            <div class="box-body">
              йцуайуца
            </div>
          </div>

          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Cтраница</h3>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="pageTitle">Заголовок</label>
                <input type="text" id="pageTitle" class="form-control" placeholder="Введите заголовок страницы" />
                <div class="form-control" ref="editor" contentEditable="true" />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addPageHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updatePageHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.updatePageHandler.bind(this)}> Новая</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
