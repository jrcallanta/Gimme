import { useState, useEffect, useContext } from 'react';
import React from 'react';
import { matchPath } from 'react-router'
import { NavLink, useLocation } from 'react-router-dom';
import classes from './Navbar.module.scss';
import { AuthContext } from '../store/auth-context';



function Navbar(props){
  const ctx = useContext(AuthContext)
  const location = useLocation()
  const [tabs, setTabs] = useState([])

  useEffect(() => {
    setTabs((ctx.token && ctx.currentUser)
      ? [ { id: 'catalog', to: `/${ctx.currentUser.handle}/lists/all-items`},
          { id: 'account', to: `/account` } ]
      : [ { id: 'login', to: '/login'},
          { id: 'register', to: '/register'} ]
    )
  }, [ctx])


  const onClickTab = (event, tabIndex) => {
    let tab = event.target.querySelector('a');
    if(tab) tab.click();
  }


  const tabClass = (isActive, tab) => {
    if(tab.id === 'catalog' && ctx.token && ctx.currentUser){
      const match = matchPath({
        path: `/:username/lists/:listId`,
        strict: true
      }, location.pathname)

      return (match && match.params && match.params.username === ctx.currentUser.handle)
        ? `${classes.Navbar__tabs__tab} ${classes.active}`
        : `${classes.Navbar__tabs__tab}`
    }

    else return (isActive)
      ? `${classes.Navbar__tabs__tab} ${classes.active}`
      : `${classes.Navbar__tabs__tab}`
  }

  return (
    <nav className={classes.Navbar}>
      <NavLink tabIndex={-1} to={`/`} className={classes.Navbar__brand}>
        G
      </NavLink>
      <ul className={classes.Navbar__tabs}>
        {
          tabs.map((tab,i) => {
            return (
              <li
                key={i}
                onClick={e=>onClickTab(e,i)}
                >
                <NavLink
                  tabIndex='-1'
                  key={i}
                  to={tab.to}
                  className={({isActive})=>tabClass(isActive, tab)}
                  >{tab.id}</NavLink>
              </li>
            )
          })
        }
      </ul>
      {/* <input type="text" className={classes.Navbar__search}/> */}
    </nav>
  );
}

export default Navbar;
