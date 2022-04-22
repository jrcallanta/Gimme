import { useState } from 'react'
import Tooltip from './Tooltip';

import classes from './Forms.module.scss'

function SingleInputForm(props) {

  const [feedback, setFeedback] = useState('change')
  const [hint, setHint] = useState('')

  const handleValueChange = (event) => {
    setFeedback('change')
    const submitButton = event.target.form.querySelector('button');
    if(event.target.value.trim() !== '')
      submitButton.disabled = false;
    else
      submitButton.disabled = true;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const val = event.target.querySelector('input').value.trim();
    if(val !== '') {
      setFeedback('changing...')
      const result = await props.onSubmitWithErrorCheck(val);
      if(result.error && result.message) {
        setFeedback('change')
        setHint(result.message)
      }
      else {
        const submitButton = event.target.querySelector('button');
        submitButton.disabled = true;

        const input = event.target.querySelector('input');
        input.placeholder = val;
        input.value = '';
        input.blur();
        setFeedback('changed!')
        setHint('')
      }
    }
  }

  return (
    <form className={classes.form} onSubmit={handleFormSubmit}>
      <div className={classes.formGroup}>
        <div className={classes.labelLine}>
          <h2 className={classes.labelLine__text}>{props.label}</h2>
          { props.tooltip &&
            <Tooltip tip={props.tooltip} />
          }
        </div>
        <div className={classes.formInput}>
          { props.prepend &&
            <span className={classes.formInput__prepend}>{props.prepend}</span>
          }
          <input type="text" maxLength='20' placeholder={props.placeholder} onChange={handleValueChange}/>
          <button disabled={true} className={`${classes.form__submit} ${classes.append}`}>{feedback}</button>
        </div>
        <p className={classes.hint}>{hint}</p>
      </div>
    </form>
  );
}

export default SingleInputForm;
