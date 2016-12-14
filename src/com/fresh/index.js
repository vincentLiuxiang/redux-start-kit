import React, {Component} from 'react';

export default class Fresh extends Component {

  render () {
    return (
      <button onClick={() => this.props.onClick()}>
        {this.props.text}
      </button>
    );
  }
}