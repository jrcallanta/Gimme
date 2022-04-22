import { useState, useRef, useEffect } from 'react';
import { useOnClickOutsideOfFocused, useOnPressEnterInFocused } from '../../../tools/CustomHooks'
import classes from './AddLink.module.scss';

function AddLink(props) {
  const [state, setState] = useState({isCreating: false})
  const inputRef = useRef(null);
  const linkRef = useRef(null);

  useOnClickOutsideOfFocused(linkRef, inputRef, exitCreateMode);

  useOnPressEnterInFocused(inputRef, ()=>{
    if(inputRef.current.value.trim() !== ''){
      props.onAddLink(inputRef.current.value.trim());
      if(inputRef.current) inputRef.current.value = '';
    }
  })

  useEffect(()=>{
    if(state.isCreating){
      inputRef.current.focus();
    }
  }, [state])

  function handleIconClick(event) {
    if(state.isCreating){
      inputRef.current.value = '';
    }
  }

  // function handleKeyDown(event) {
  //   if(event.key.toLowerCase() === "enter") {
  //     if(inputRef.current && inputRef.current.value.trim() !== ''){
  //       props.onAddLink(inputRef.current.value.trim());
  //       exitCreateMode();
  //     }
  //   }
  // }

  function enterCreateMode() {
    setState({isCreating: true});
  }

  function exitCreateMode() {
    setState({isCreating: false});
  }

  return (
    <div ref={linkRef} className={classes.AddLink} onClick={enterCreateMode}>
      <div className={classes.plusButton} onClick={handleIconClick}>
        <div className={
          (state.isCreating)
          ? `${classes.plusButton__icon} ${classes.rotated}`
          : `${classes.plusButton__icon}`}>
        </div>
      </div>

      <div className={classes.text}>
        {
          (state.isCreating)
          ? <input
            ref={inputRef}
            type="text"
            // onKeyDown={handleKeyDown}
            // onBlur={exitCreateMode}
            className={classes.text__input}
            placeholder={props.placeholder}
          />

          : <p
            ref={inputRef}
            className={classes.text__fixed}
            >
              {props.placeholder}
          </p>
        }
      </div>
    </div>
  );
}

export default AddLink;
