import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Tree from 'react-ui-tree';
import 'react-ui-tree/dist/react-ui-tree.css';
import Settings from '../../../core/helpers/Settings';
import { Checkbox, Radio, RadioGroup } from 'react-icheck';
import { dispatch } from '../../../core/helpers/EventEmitter';
import { buildUrl } from '../../../core/helpers/Utils';
import { get } from '../../../actions/Menu';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);

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
      menu: {}
    };
  }

  _loadCategoryTree() {
    get(
      { id: this.props.params.id },
      (items) => this.setState({
        menu: items
      }, () => console.log(this.state)),
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
    this._loadCategoryTree();
  }

  /**
   * Event should be fired on component render
   */
  initDialogs() {
    // this.deleteСategoryDialog =
    //   <DeleteCategoryDialog
    //     onDeleteClick={this._deleteCategory.bind(this)}
    //   />;
  }

  addMenuHandler() {}

  updateMenuHandler() {}

  deleteMenuHandler() {}

  resetMenuHandler() {}

  handleChange(tree) {
    // Normalize parrent ids
    this.normalizeBranch(tree, null);

    // treeUpdate(
    //   { tree: JSON.stringify(tree) },
    //   (tree) => {},
    //   (e) => {
    //     dispatch('notification:throw', {
    //       type: 'danger',
    //       title: 'Ошибка',
    //       message: e.responseJSON.error
    //     });
    //   }
    // );
  }

  normalizeBranch(tree, parrentId) {
    if (tree.children.length > 0) {
      tree.children.map(
        (branch) => {
          return ((tree) => {
            Object.assign(branch, { parrentId: tree.id, order: this.categoryOrder++ });
            this.normalizeBranch(branch, tree);
          })(tree);
        }
      );
    }
  }

  onItemSelect(item) {
    if (item.id === "") {
      // return this.resetCategoryHandler();
    }
    this.setState({ selected: item, mode: 'edit' });
  }

  renderNode(node) {
    return (
      <div
        class={classNames({ active: node === this.state.selected }, node.className )}
        onClick={this.onItemSelect.bind(this, node)}
      >
        {node.module}
      </div>
    );
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
            </div>
            <div class="box-footer">
            {
              (this.state.mode === 'add') ?
                <button type="submit" class="btn btn-primary fa fa-check" onClick={this.addMenuHandler.bind(this)}> Добавить</button> :
                <div class="btn-group">
                  <button type="submit" class="btn btn-primary fa fa-check" onClick={this.updateMenuHandler.bind(this)}> Сохранить</button>
                  <button type="submit" class="btn btn-default fa fa-file-o" onClick={this.resetMenuHandler.bind(this)}> Новый</button>
                  <button type="submit" class="btn btn-danger fa fa-trash" onClick={this.deleteMenuHandler.bind(this)}> Удалить</button>
                </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
