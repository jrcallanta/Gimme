import React, { Suspense, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './store/auth-context';

import Layout from './layout/Layout';
import Main from './layout/Main';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import LoaderIcon from './components/LoaderIcon';

import UserHandler from './pages/UserHandler/UserHandler'
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import InvalidPage from './pages/Invalid';

// Lazy Loading
const AccountPage = React.lazy(() => import('./pages/AccountPage/Account'))

function App() {
  const ctx = useContext(AuthContext);


  return (
    <Layout>
      <Dashboard type={(ctx.currentUser) ? 'fullscreen' : 'window'}>
        <Navbar currentUser={(ctx.currentUser)
          ? ctx.currentUser
          : null
        }/>

        <Suspense fallback={<LoaderIcon/>}>
          <Routes>

            <Route path="/" element={<Main />}>
              <Route path=":userHandle/*" element={<UserHandler/>}/>


              <Route path="" element={
                (ctx.currentUser)
                ? <Navigate to={`/${ctx.currentUser.handle}/lists/all-items`}/>
                : (ctx.isLoggingIn)
                ? <LoaderIcon/>
                : <Navigate to="login" replace={true}/>
              }/>


              <Route path="login/*">
                <Route path="" element={
                  (ctx.currentUser)
                  ? <Navigate to={`/${ctx.currentUser.handle}`} replace={true}/>
                  : <LoginPage/>
                }/>
                <Route path="*" element={<Navigate to="/login"/>}/>
              }</Route>


              <Route path="register/*" >
                <Route path="" element={
                  (ctx.currentUser)
                  ? <Navigate to={`/${ctx.currentUser.handle}`} replace={true}/>
                  : <RegisterPage/>
                }/>
                <Route path="*" element={<Navigate to="/register"/>}/>
              </Route>


              <Route path="account/*" index element={
                (ctx.currentUser)
                ? <AccountPage/>
                : (ctx.isLoggingIn)
                ? <LoaderIcon/>
                : <InvalidPage
                  heading={'Unauthorized Page'}
                  body={'You must be logged in to access this page. Please log in.'}
                />
              }/>

              <Route path="*" element={<InvalidPage/>}/>
            </Route>

          </Routes>
        </Suspense>
      </Dashboard>
    </Layout>
  );
}

export default App;
