import { useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../store/auth-context';

import classes from './LoginRegister.module.scss';
import formClasses from '../components/FormInputs/Forms.module.scss';


function LoginPage(props) {
  const submitRef = useRef(null)
  const [submitText, setSubmitText] = useState('login')
  const [hint, setHint] = useState(null);
  const ctx = useContext(AuthContext);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    submitRef.current.disabled = true;
    setSubmitText('logging in...')
    const username = event.target.querySelector('input[name="username"]').value;
    const password = event.target.querySelector('input[name="password"]').value;
    const result = await ctx.onLogIn(username, password);
    if(result){
      if(result.sucess) {
         // should've been redirected
         setSubmitText('logged in!')
      }
      else {
        submitRef.current.disabled = false;
        setSubmitText('login')
        setHint(`* ${result.message}`)
      }
    }
  }

  return (
    <div className={classes.LoginPage}>
      <div className={classes.loginForm}>
        <form className={formClasses.form} onSubmit={handleFormSubmit}>
          <h2 className={classes.heading}>Sign In</h2>

          <div className={formClasses.combinedInputGroup}>
            <div className={formClasses.formGroup}>
              <h2 className={formClasses.label}>Username / Email</h2>
              <div className={formClasses.formInput}>
                <input name="username" type="text" />
              </div>
            </div>

            <div className={formClasses.formGroup}>
              <h2 className={formClasses.label}>Password</h2>
              <div className={formClasses.formInput}>
                <input name="password" type="password" />
              </div>
              {hint && <p className={formClasses.hint}>{hint}</p>}
            </div>

            <button ref={submitRef} className={formClasses.form__submit}>{submitText}</button>
          </div>
        </form>

        <div className={classes.registerNavigation}>
          <NavLink to="/register">Don't have an account? Register</NavLink>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
