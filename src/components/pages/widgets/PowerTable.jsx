import React from 'react';

export default class PowerTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      columns: this.props.columns
    };
  }

  componentWillReceiveProps({ data }) {
    this.setState({ data });
  }

  componentDidMount() {
    let sortables  = this.state.columns.map(({ sort }, key) => ({
      'bSortable': (sort === false) ? false : true,
      'aTargets': [ key ]
    }));

    $(this.refs.table).DataTable({
      'aoColumnDefs': sortables
    });
  }

  get emptyTable() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }

  get headings() {
    return (
      <tr>
        {
          this.state.columns.map(({ display, name }) => (
            <th key={name}>{ display }</th>
          ))
        }
      </tr>
    );
  }

  render() {
    if (this.state.data.length === 0) {
      return this.emptyTable;
    }

    return (
      <table ref="table" class="table table-bordered table-hover">
        <thead style={{ display: this.props.header || typeof this.props.header === 'undefined' ? 'static' : 'none' }}>
          { this.headings }
        </thead>
        <tbody>
          {
            this.state.data.map((row) => (
              <tr key={row.id}>
                {
                  this.state.columns.map(({ name, renderer }) => {
                    if (typeof renderer === 'function') {
                      return (<td key={row.id.concat(name)}>{renderer(row)}</td>);
                    }
                    else {
                      return (<td key={row.id.concat(name)}>{row[name]}</td>);
                    }
                  })
                }
              </tr>
            ))
          }
        </tbody>
        {
          this.props.footer &&
          <tfoot>
            { this.headings }
          </tfoot>
        }
      </table>
    );
  }
}
