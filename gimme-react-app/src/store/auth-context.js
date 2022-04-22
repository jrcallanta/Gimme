import React, { useState, useEffect } from 'react';
import { makePost, makeDelete } from '../tools/APIRequests';


export const AuthContext = React.createContext({
  token: null,
  currentUser: null,
  isLoggingIn: false,
  onRegister: () => {},
  onLogIn: () => {},
  onLogOut: () => {},
  onUpdateUser: () => {}
})


function AuthContextProvider(props) {
  const initialToken = localStorage.getItem('token')
  const [token, setToken] = useState(initialToken);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if(!currentUser && token){
        setIsLoggingIn(true);

        const result = await makePost(`/login/withToken/`, {token: token})
          .then((res) => res.json());

        if(result && result.token) {
          localStorage.setItem('token', result.token);
          setToken(result.token)
          setCurrentUser(result.user)
          setIsLoggingIn(false);
        } else {
          localStorage.removeItem('token')
          setToken(null)
          setIsLoggingIn(false)
        }
      }
    }

    fetchData();
  }, [currentUser, token])



  const registerHandler = async (body) => {
    const result = await makePost(`/users/`, body)
      .then((res) => res.json())

    if(!result.error) {
      return await loginHandler(result.user.handle, body.password)
    } else {
      return result
    }
  }



  const loginHandler = async (handle, password) => {
    const result = await makePost(`/login`, {handle: handle, password: password})
      .then((res) => res.json());
    if(result && result.token) {
      setIsLoggingIn(true)
      localStorage.setItem('token', result.token);
      setCurrentUser(result.user)
      setToken(result.token)
        setIsLoggingIn(false)
    } else {
      return {
        message: result.message
      }
    }
  }



  const logoutHandler = async () => {
    const result = await makeDelete('/login',
      {
        validation: { token: token, userId: currentUser._id }
      }
    ).then((res) => res.json());

    if(!result.error) {
      localStorage.removeItem('token');
      setToken(null)
      setCurrentUser(null);
      return result
    }
    else {
      return result
    }
  }



  return <AuthContext.Provider value={{
      token: token,
      currentUser: currentUser,
      isLoggingIn: isLoggingIn,
      onRegister: registerHandler,
      onLogIn: loginHandler,
      onLogOut: logoutHandler,
      onUpdateUser: setCurrentUser
    }}>{props.children}
  </AuthContext.Provider>
}

export default AuthContextProvider;
