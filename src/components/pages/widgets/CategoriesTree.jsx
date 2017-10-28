import React from 'react';

export default class CategoriesTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.categories
    };
  }

  _getById(catId) {
    return this.state.categories.filter(({ id }) => id === catId)[0];
  }

  get selected() {
    return this._getById(this.refs.categoryTree.value);
  }

  componentWillReceiveProps({ categories }) {
    let tree = [];

    categories.forEach((category) => {
      tree = tree.concat(this.categoryBranch(category));
    });

    this.setState({ categories: tree });
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
    this.props.onSelect(
      this._getById(e.target.value)
    );
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
