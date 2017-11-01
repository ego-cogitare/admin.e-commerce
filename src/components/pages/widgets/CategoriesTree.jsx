import React from 'react';

export default class CategoriesTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.categories,
      multiple: false
    };
  }

  _getByIds(ids) {
    return this.state.categories.filter(({ id }) => ids.indexOf(id) !== -1);
  }

  get selected() {
    return this._getById(this.refs.categoryTree.value);
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

  onChange(e) {
    const categories = this._getByIds($(e.target).val() || []);

    this.state.multiple ?
      this.props.onSelect(categories) :
      this.props.onSelect(categories[1]);
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
