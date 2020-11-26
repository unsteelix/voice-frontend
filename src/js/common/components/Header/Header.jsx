import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.css';

class Header extends PureComponent {
  render() {
    const { location } = this.props;
    const { pathname } = location;

    const isHome = pathname === '/';
    const isJustAnotherPage = pathname === '/about';

    return (
      <header className={styles.globalHeader}>
        <div className={styles.listLink}>
          <div className={!isHome ? `${styles.oneLink} ${styles.active}` : `${styles.oneLink}`}>
            {isHome ? 'Home' : <Link to="/">Home</Link>}
          </div>
          <div className={!isJustAnotherPage ? `${styles.oneLink} ${styles.active}` : `${styles.oneLink}`}>
            {isJustAnotherPage ? (
              'about'
            ) : (
              <Link to="/about">about</Link>
            )}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
