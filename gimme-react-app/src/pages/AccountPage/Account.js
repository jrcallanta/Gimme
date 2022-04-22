import { useState, useEffect, useContext } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import SettingsForm from './Forms/Settings'
import ChangePasswordForm from './Forms/ChangePassword'
import { AuthContext } from '../../store/auth-context';
import { makeGet, makePatch } from '../../tools/APIRequests';

import classes from './Account.module.scss';

const navigationTabs = [
  {
    name: 'Account Settings',
    path: '/account/account-settings'
  },
  {
    name: 'Change Password',
    path: '/account/change-password'
  },
  {
    name: 'Logout',
    path: '/account/logout'
  },
]

function AccountPage(props) {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const result = await makeGet(`/users/${ctx.currentUser._id}`)
      if(result.user) setUser(result.user)
    }
    fetch()
  }, [])


  const sendUpdate = async (key, val) => {
    let newValue = val;
    if(key === 'password'){
      const result = await makePatch(`/users/${ctx.currentUser._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          changes: {
            password: {oldPassword: val[0], newPassword: val[1]}
          }
        }
      ).then((res)=>res.json());

      if(!result.error) {
        ctx.onUpdateUser(result.user)
        setUser(result.user)
        return { message: result.message }
      }
      else return { message: 'Incorrect password', error: {} }
    }

    else if(newValue !== user[key]) {
      const changes = {}
      changes[key] = newValue;

      const result = await makePatch(`/users/${ctx.currentUser._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          changes: changes
        }
      ).then((res)=>res.json());

      if(!result.error) {
        ctx.onUpdateUser(result.user)
        setUser(result.user)
        return { message: result.message }
      }
      else return { message: result.message, error: result.error }
    }

    else return { message: `This is already your ${key}.`, error: {} }
  }

  const logOutHandler = async () => {
    const result = await ctx.onLogOut();
    if(!result.error) navigate('/login')
  }

  const navItemClass = ({isActive}) => {
    return (isActive)
      ? `${classes.active}`
      : ''
  }

  if(!user) return '';
  return (
    <div className={classes.Account}>
      <div className={classes.head}>
        <div className={classes.usercard}>
          <h1 className={classes.userName}>{user.name}</h1>
          <h3 className={classes.userHandle}>{`@${user.handle}`}</h3>
          <div className={classes.stats}>
            <NavLink to={`/${user.handle}`} className={classes.stats__stat}>
              <span className={classes.stats__stat__num}>{user.statistics.totalLists}</span>
              <span>Lists</span>
            </NavLink>
            <NavLink to={`/${user.handle}`} className={classes.stats__stat}>
              <span className={classes.stats__stat__num}>{user.statistics.totalItems}</span>
              <span>Items</span>
            </NavLink>
          </div>
        </div>
        <p className={classes.activity}>
          Last seen: {(new Date(user.activity.lastSeen))
            .toLocaleString("en-US", {dateStyle: 'short', timeStyle: 'short'})
          }
        </p>
      </div>



      <div className={`${classes.body} ${classes.test}`}>
        <div className={classes.navigation}>
          <ul>
            {
              navigationTabs.map((tab) => {
                if(tab.path === '/account/logout')
                  return <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={navItemClass}
                  onClick={logOutHandler}
                  > {tab.name} </NavLink>

                else
                  return <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={navItemClass}
                  > {tab.name} </NavLink>
              })
            }
          </ul>
        </div>

        <div className={classes.display}>
          <Routes>
            <Route path='/account-settings' exact element={
              <SettingsForm user={user} onMakeChange={sendUpdate}/>
            }/>

            <Route path='/change-password' exact element={
              <ChangePasswordForm user={user} onMakeChange={sendUpdate}/>
            }/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
