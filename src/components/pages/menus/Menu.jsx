import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Tree from 'react-ui-tree';
import 'react-ui-tree/dist/react-ui-tree.css';
import DeleteItemDialog from './popups/DeleteItemDialog.jsx';
import Settings from '../../../core/helpers/Settings';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get, update, itemAdd, itemUpdate, itemRemove } from '../../../actions/Menu';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.itemOrder = 0;

    this.emptyItem = {
      id: '',
      parrentId: '',
      title: '',
      module: '',
      link: '',
      isHidden: false,
      isDeleted: false
    };

    this.state = {
      mode: this.props.params.id ? 'edit' : 'add',
      menu: {},
      selected: {}
    };
  }

  _loadMenuTree() {
    get(
      { menuId: this.props.params.id },
      (menu) => this.setState({ menu }),
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
      pageTitle: 'Управление меню'
    });

    // Get categories list
    this._loadMenuTree();
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    this.deleteItemDialog =
      <DeleteItemDialog
        onDeleteClick={this._deleteItem.bind(this)}
      />;
  }

  _deleteItem() {
    dispatch('popup:close');

    itemRemove(
      { menuId: this.props.params.id, id: this.state.selected.id },
      (r) => {
        // Update menu tree
        this._loadMenuTree();

        dispatch('notification:throw', {
          type: 'warning',
          title: 'Успех',
          message: 'Пункт меню удален'
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

  addMenuHandler(e) {
    e.preventDefault();

    if (typeof this.state.selected.id === 'undefined') {
      return ;
    }

    itemAdd(
      Object.assign({ ...this.state.selected }, { menuId: this.props.params.id }),
      (menu) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Пункт меню добавлен'
        });
        this.setState({ mode: 'edit' },
          () => this._loadMenuTree()
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

  updateMenuHandler(e) {
    e.preventDefault();

    if (typeof this.state.selected.id === 'undefined') {
      return ;
    }

    itemUpdate(
      { ...this.state.selected },
      (item) => {
        dispatch('notification:throw', {
          type: 'success',
          title: 'Успех',
          message: 'Данные меню сохранены'
        });
        this.setState({ mode: 'edit' },
          () => this._loadMenuTree()
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

  deleteItemHandler(e) {
    e.preventDefault();

    if (typeof this.state.selected.id === 'undefined') {
      return ;
    }

    dispatch('popup:show', {
      title: 'Подтвердите действие',
      body: this.deleteItemDialog
    });
  }

  insertMenuHandler() {

    if (typeof this.state.selected.id === 'undefined') {
      return ;
    }

    const item = Object.assign(
      { ...this.emptyItem },
      {
        module: 'Пункт меню',
        title: 'Пункт меню',
        className: 'font-italic text-gray',
        parrentId: this.state.selected.id,
        isNew: true,
        children: []
      }
    );

    this.state.selected.children.push(item);
    this.setState({ mode: 'add', selected: item });
  }

  handleChange(tree) {
    // Normalize parrent ids
    this.normalizeBranch(tree, null);

    update(
      { tree: JSON.stringify(tree), menuId: this.props.params.id },
      (tree) => {},
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  normalizeBranch(tree, parrentId) {
    if (tree.children.length > 0) {
      tree.children.map(
        (branch) => {
          return ((tree) => {
            Object.assign(branch, { parrentId: tree.id, order: this.itemOrder++ });
            this.normalizeBranch(branch, tree);
          })(tree);
        }
      );
    }
  }

  onItemSelect(item) {
    this.setState({ selected: item, mode: item.isNew ? 'add' : 'edit' });
  }

  renderNode(node) {
    return (
      <div
        class={classNames({ active: node === this.state.selected }, node.className )}
        onClick={this.onItemSelect.bind(this, node)}
      >
        { node.module }
      </div>
    );
  }

  itemTitleChange(e) {
    this.state.selected.title =
    this.state.selected.module = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  itemLinkChange(e) {
    this.state.selected.link = e.target.value;
    this.setState({ selected: this.state.selected });
  }

  render() {
    this.initDialogs();

    return (
      <div class="row">
        <div class="col-xs-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Меню</h3>
            </div>
            <div class="box-body">
              <div class="form-group category-tree">
                <Tree
                  paddingLeft={20}
                  tree={this.state.menu}
                  onChange={this.handleChange.bind(this)}
                  renderNode={this.renderNode.bind(this)}
                />
              </div>
              <div class="form-group">
                <label for="itemTitle">Название пункта меню *</label>
                <input
                  type="text"
                  class="form-control"
                  id="itemTitle"
                  onChange={this.itemTitleChange.bind(this)}
                  value={this.state.selected.title || ''}
                  placeholder="Введите название пункта меню"
                />
              </div>
              <div class="form-group">
                <label for="itemTitle">Ссылка *</label>
                <input
                  type="text"
                  class="form-control"
                  id="itemLink"
                  onChange={this.itemLinkChange.bind(this)}
                  value={this.state.selected.link || ''}
                  placeholder="Введите ссылку пункта меню"
                />
              </div>
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addMenuHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class={"btn btn-primary fa fa-check".concat(this.state.selected.parrentId === "" ? " disabled" : "")} onClick={this.updateMenuHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.insertMenuHandler.bind(this)}> Новый</button>
                  <button type="submit" class={"btn btn-danger fa fa-trash".concat(this.state.selected.parrentId === "" ? " disabled" : "")} onClick={this.deleteItemHandler.bind(this)}> Удалить</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
