import React, { PureComponent } from 'react';

import styles from './Login.css';

class Login extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      input : ''
    };

    this.inputChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      input: ''
    });
  }

  inputChange = (e) => {
    let val = e.target.value.trim()

    this.setState({
      input: val
    });
  }

  render() {
    const { loginButton, text } = this.props;
    const { pathname } = location;

    return (
      <div className={styles.login}>
        <div className={styles.textBlock}>{text}</div>
        <div className={styles.inputBlock}>
          <input className={styles.input} type="text" value={this.state.input} onChange={this.inputChange} />
        </div>
        <div className={styles.button} onClick={ () => loginButton(this.state.input) }>Вход</div>
      </div>
    );
  }
}

export default Login;
