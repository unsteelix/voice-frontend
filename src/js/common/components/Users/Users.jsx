import React, { PureComponent } from 'react';

import styles from './Users.css';

class Users extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      peer : props.peer
    };

    this.audio = React.createRef();
  }

  componentDidMount() {

  }




  render() {
    const { users, callButton, localStream, remoteStream } = this.props;

    console.log('ll', localStream)
    console.log('rr', remoteStream)

    const listUser = users.map((user) =>
      <div key={user} onClick={() => callButton(user) }>{user}</div>
    );
    
    return (
      <div className={styles.users}>
        {/*
        <div>Local: { localStream ? <audio ref={audio => { audio.srcObject = localStream }} controls autoPlay muted /> : '...' }</div>
        */}
        { remoteStream && 
        <div>Звонок: { remoteStream ? <audio ref={audio => { audio.srcObject = remoteStream }} controls autoPlay /> : '...' }</div>
        }
        Пользователи:
        {listUser}
      </div>
    );
  }
}

export default Users;
