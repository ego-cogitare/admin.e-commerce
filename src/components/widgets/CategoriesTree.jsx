import React from 'react';

export default class CategoriesTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.categories,
      multiple: false
    };
  }

  get selected() {
    const categories = this._getByIds($(this.refs.categoryTree).val());
    return this.state.multiple ? categories : categories[0];
  }

  componentWillReceiveProps({ categories, multiple }) {
    let tree = [];

    categories.forEach((category) => {
      tree = tree.concat(this.categoryBranch(category));
    });

    this.setState({ categories: tree, multiple });

    // Set multiple option for category tree
    this.refs.categoryTree.multiple = multiple || false;
  }

  categoryBranch(category, branch = [], depth = 0) {
    branch.push(
      Object.assign(category, { level: depth })
    );

    if (!category.categories) {
      return branch;
    }

    category.categories.forEach(
      (category) => this.categoryBranch(category, branch, depth + 1)
    );

    return branch;
  }

  _getByIds(ids) {
    if (!this.props.multiple) {
      ids = [ids];
    }
    return this.state.categories.filter(({ id }) => (ids || []).indexOf(id) !== -1);
  }

  onChange(e) {
    const categoryIds = $(e.target).val();
    const categories = this._getByIds(categoryIds);

    this.state.multiple ?
      this.props.onSelect(categories) :
      this.props.onSelect(categories[0]);
  }

  render() {
    return (
      <select ref="categoryTree" class={this.props.className} onChange={this.onChange.bind(this)} size={this.props.size}>
        {
          this.state.categories.map((category) => {
            return (
              <option
                value={category.id}
                key={category.id}
                style={{ textIndent: category.level * this.props.categoryIndent }}
                class={'level-' + category.level + ' ' + category.className}
              >{category.title}</option>
            );
          })
        }
      </select>
    );
  }
}
