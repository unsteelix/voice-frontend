import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import LazyLoading from 'common/components/LazyLoading'

import styles from '../style/index.css'

import MainRouteHandler from 'views/main'

// This is show case how you can lazy loading component
const ExampleRouteHandler = LazyLoading(() => import('views/example'))
const Header = LazyLoading(() => import('common/components/Header/Header'))

// Please remove that, it is an example
const JustAnotherPage = () => (
  <div>
    <h2>Спасибо всем (нет)<br/>
      кто помогал (т.е. никто)<br/>
      с разработкой данного приложения</h2>
    <p>
      Die skype for bednih !!!
    </p>
  </div>
)

// This show case how you can access routing info in your component
const HeaderWithRouter = withRouter((props) => <Header {...props} />)

module.exports = (
  <div className={styles.container}>
    <HeaderWithRouter />
    
    <div className={styles.content}>
      <Switch>
        <Route exact path="/" component={MainRouteHandler} />
        <Route path="/about" component={JustAnotherPage} />

        <Route path="*" component={ExampleRouteHandler} />
      </Switch>
    </div>
  </div>
)
