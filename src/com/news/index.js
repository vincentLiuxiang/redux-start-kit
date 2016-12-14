import React, {Component} from 'react';

export default class Fresh extends Component {

  shouldComponentUpdate (nprops) {
    return true
  }

  render () {
    let {news} = this.props;
    return (
      <ul>
        {
          (news || []).map((n,i) => {
            return <li key={i}><a href={n.url} target='_blank'>{n.text}</a></li>
          })
        }
      </ul>
    );
  }
}