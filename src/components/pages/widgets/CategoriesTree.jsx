import React from 'react';

export default class CategoriesTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.categories
    };
  }

  categoryBranch(category, branch = [], depth = 0) {

    branch.push({
      id: category.id,
      level: depth,
      title: category.title,
      className: category.className || ''
    });

    if (!category.categories) {
      return branch;
    }

    category.categories.forEach(
      (category) => this.categoryBranch(category, branch, depth + 1)
    );

    return branch;
  }

  onSelect(category) {
    this.props.onSelect(category);
  }

  render() {
    return (
      <select class={this.props.className} size={this.props.size}>
        {
          this.state.categories.map((category) => {
            const branch = this.categoryBranch(category);

            return branch.map((category) => {
              return (
                <option
                  key={category.id}
                  onClick={this.onSelect.bind(this, category)}
                  style={{ textIndent: category.level * this.props.categoryIndent }}
                  class={'level-' + category.level + ' ' + category.className}
                >{category.title}</option>);
            });
          })
        }
      </select>
    );
  }
}
