import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../store/auth-context';

import Tooltip from '../components/FormInputs/Tooltip';
import classes from './LoginRegister.module.scss';
import formClasses from '../components/FormInputs/Forms.module.scss';


function RegisterPage(props) {
  const ctx = useContext(AuthContext)
  const submitRef = useRef(null);
  const [nameValid, setNameValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [submitText, setSubmitText] = useState('continue');
  const [hints, setHints] = useState({
    username: null,
    email: null,
  })


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    submitRef.current.disabled = true;
    setSubmitText('loading...')
    const form = event.target;
    const body = {
      name: form.querySelector('input[name="name"]').value.trim(),
      handle: form.querySelector('input[name="username"]').value.trim(),
      email: form.querySelector('input[name="email"]').value.trim(),
      password: form.querySelector('input[name="password"]').value.trim(),
    }
    const result = await ctx.onRegister(body)
    if(!result.error){
      setTimeout(()=>{
        setSubmitText('registered!')
      }, 3000)
    } else {
      console.log(result)
      const { error } = result;
      const hints = { username: null, email: null }

      // if errors catch by database validation
      if(error.errors) {
        if(error.errors.email)
          hints.email = error.errors.email.message
        if(error.errors.handle)
          hints.username = error.errors.handle.message
      }

      // if errors caught by api
      else {
        if(error.username) {
          hints.username = error.username.message
        }
        if(error.email) {
          hints.email = error.email.message
        }
      }

      setHints(hints)
      setSubmitText('continue')
      submitRef.current.disabled = false;
     }
  }


  const checkValidInputs = (event, setter) => {
    const val = event.target.value.trim();

    if(event.target.name === "password"){
      console.log('handling password')
      if(val !== event.target.value) setter(false);
      else if(val.length < 8) setter(false);
      else setter(true)
    }
    else if(val !== '') setter(true)
    else setter(false)
  }


  useEffect(() => {
    if(nameValid && usernameValid && emailValid && passwordValid){
      if(submitRef) submitRef.current.disabled = false
    }
    else {
      if(submitRef) submitRef.current.disabled = true
    }
  }, [nameValid, usernameValid, emailValid, passwordValid])


  return (
    <div className={classes.RegisterPage}>
      <div className={classes.registerForm}>
        <form className={formClasses.form} onSubmit={handleFormSubmit}>
          <h2 className={classes.heading}>Register</h2>

            <div className={formClasses.formGroup}>
              <div className={formClasses.labelLine}>
                <h2 className={formClasses.labelLine__text}>Enter Name</h2>
              </div>
              <div className={formClasses.formInput}>
                <input
                  onChange={(e)=>checkValidInputs(e, setNameValid)}
                  name="name"
                  type="text"/>
              </div>
            </div>

            <div className={formClasses.formGroup}>
              <div className={formClasses.labelLine}>
                <h2 className={formClasses.labelLine__text}>Enter Username</h2>
                <Tooltip
                  tip={`Usernames can only contain letters, numbers, and underscores`}
                />
              </div>
              <div className={formClasses.formInput}>
                <input
                  onChange={(e)=>checkValidInputs(e, setUsernameValid)}
                  name="username" type="text"/>
              </div>
              {hints.username && <p className={formClasses.hint}>{hints.username}</p>}
            </div>

            <div className={formClasses.formGroup}>
              <div className={formClasses.labelLine}>
                <h2 className={formClasses.labelLine__text}>Enter Email</h2>
                <Tooltip
                  tip={`Input must be a valid email address`}
                />
              </div>
              <div className={formClasses.formInput}>
                <input
                  onChange={(e)=>checkValidInputs(e, setEmailValid)}
                  name="email" type="text"/>
              </div>
              {hints.email && <p className={formClasses.hint}>{hints.email}</p>}
            </div>

            <div className={formClasses.formGroup}>
              <div className={formClasses.labelLine}>
                <h2 className={formClasses.labelLine__text}>Enter Password</h2>
                <Tooltip
                  tip={`Password cannot start or end with spaces and must be at least 8 characters long`}
                />
              </div>
              <div className={formClasses.formInput}>
                <input
                  onChange={(e)=>checkValidInputs(e, setPasswordValid)}
                  name="password" type="password"/>
              </div>
            </div>

            <button ref={submitRef} disabled={true} className={formClasses.form__submit}>{submitText}</button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage;
