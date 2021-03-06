import React from 'react';
import { subscribe } from '../../../core/helpers/EventEmitter';

export default class LeftMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pageTitle: ''
    };
  }

  componentWillMount() {
    subscribe('page:titles:change', (payload) => this.setState(payload));
  }

  render() {
    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            { this.state.pageTitle }
            <small></small>
          </h1>
        </section>
        <section className="content">
          { this.props.children }
        </section>
      </div>
    );
  }
}
