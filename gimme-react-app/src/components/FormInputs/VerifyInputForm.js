import { useState, useRef } from 'react'

import Tooltip from './Tooltip';

import classes from './Forms.module.scss'

function VerifyInputForm(props) {

  const [hints, setHints] = useState({hint1: null, hint2: null})
  const [buttonText, setButtonText] = useState('change');
  const [feedback, setFeedback] = useState(null);
  const currentPassRef = useRef(null);
  const newPassRef = useRef(null);
  const verifyPassRef = useRef(null);

  const checkAllValues = () => {
    const currentPass = currentPassRef.current.value;
    const newPass = newPassRef.current.value;
    const verifyPass = verifyPassRef.current.value;
    if(verifyPass === '') return 'none';
    if(newPass !== ''){
      if(newPass === verifyPass) {
        if(currentPass !== '') return 'valid'
        else return 'none'
      }
      else return 'no-match'
    }
    else return 'none';
  }

  const handleValueChange = (event) => {
    const submitButton = event.target.form.querySelector('button');
    const result = checkAllValues();
    switch(result) {
      case 'no-match': { submitButton.disabled = true; setHints((prev) => { return {...prev, hint2: "passwords don't match"} }); break; }
      case 'none': { submitButton.disabled = true; setHints((prev) => { return {...prev, hint2: null} }); break; }
      case 'valid': { submitButton.disabled = false; setHints((prev) => { return {...prev, hint2: null} }); break; }
      default: { }
    }
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const currentPass = currentPassRef.current.value;
    const newPass = newPassRef.current.value;
    const verifyPass = verifyPassRef.current.value;
    if (newPass !== '' && newPass === verifyPass){
      setButtonText('changing...')
      setHints({hint1: null, hint2: null})
      setFeedback('')
      const result = await props.onSubmitWithErrorCheck(currentPass, newPass);
      if(result.error && result.message) {
        setHints({hint1: result.message, hint2: null})
        setButtonText('change')
      }
      else {
        const input = event.target.querySelectorAll('input');
        input.forEach((i) => {i.value = ''; i.blur()})
        setHints({hint1: null, hint2: null})
        setButtonText('success!')
        setFeedback('Password changed succesfully')
      }
    }
  }

  const type = (props.showValues) ? 'text' : 'password';
  return (
    <form className={classes.form} onSubmit={handleFormSubmit}>
      <div className={classes.formGroup}>
        <div className={classes.labelLine}>
          <h2 className={classes.labelLine__text}>{props.label1}</h2>
          { props.label1ToolTip &&
            <Tooltip tip={props.label1ToolTip} />
          }
        </div>
        <div className={classes.formInput}>
          <input ref={currentPassRef} type={type} maxLength='20' placeholder={props.placeholder} onChange={handleValueChange}/>
        </div>
        <p className={classes.hint}>{hints.hint1}</p>
      </div>


      <div className={classes.combinedInputGroup}>
        <div className={classes.formGroup}>
          <div className={classes.labelLine}>
            <h2 className={classes.labelLine__text}>{props.label2}</h2>
            { props.label2ToolTip &&
              <Tooltip tip={props.label2ToolTip} />
            }
          </div>
          <div className={classes.formInput}>
            <input ref={newPassRef} type={type} maxLength='20' placeholder={props.placeholder} onChange={handleValueChange}/>
          </div>
        </div>

        <div className={classes.formGroup}>
          <h2 className={classes.label}>{props.label3}</h2>
          <div className={classes.formInput}>
            <input ref={verifyPassRef} type={type} maxLength='20' placeholder={props.placeholder} onChange={handleValueChange}/>
          </div>
          <p className={classes.hint}>{hints.hint2}</p>
        </div>
      </div>

      <div className={classes.row}>
        <button disabled={true} className={classes.form__submit}>{buttonText}</button>
        <p className={classes.feedback}>{feedback}</p>
      </div>
    </form>
  );
}

export default VerifyInputForm;
