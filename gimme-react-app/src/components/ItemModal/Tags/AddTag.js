import { useState, useRef, useEffect } from 'react';
import { useOnClickOutsideOfFocused } from '../../../tools/CustomHooks'
import classes from './AddTag.module.scss';

function AddTag(props) {
  const [state, setState] = useState({isCreating: false})
  const inputRef = useRef(null);
  const tagRef = useRef(null);


  // Effect Hook to auto adjust height of text area
  useEffect(()=>{
    if(state.isCreating){
      inputRef.current.focus();
      inputRef.current.style.height = "1px";
      inputRef.current.style.height = (inputRef.current.scrollHeight)+"px";
    }
  }, [state])


  // Hook resets tag when clicking outside of
  //   tagRef while inputRef in focus
  useOnClickOutsideOfFocused(tagRef, inputRef, ()=>{
    exitCreateMode();
  })


  // Method triggers state change, entering
  //   into create mode
  function enterCreateMode(){
    setState({isCreating: true});
  }


  // Method resets text area to default value and
  //   triggers state change, exiting create mode
  function exitCreateMode() {
    inputRef.current.value = '';
    inputRef.current.cols = inputRef.current.placeholder.length - 2;
    setState({isCreating: false});
  }


  // Method called to help clear input field,
  //   primarily UI functionality
  function handleIconClick(){
    if(state.isCreating){
      inputRef.current.value = '';
      inputRef.current.cols = inputRef.current.placeholder.length - 2;
    }
  }

  // Method called to preerve provided value,
  //   if the value is not empty or exists
  function handleEnterKey(event){
    if(event.key.toLowerCase() === "enter") {
      event.preventDefault();
      if(inputRef.current && inputRef.current.value.trim() !== ''){
        if(props.onAddTag(inputRef.current.value.trim())){
          inputRef.current.value = '';
          inputRef.current.cols = inputRef.current.placeholder.length - 2;
        }
        else {
          console.log('exists');
        }
      }
    }
  }

  // Method called to auto adjust textarea width,
  //   while value is being changed,
  function adjustBoxWidth(event) {
    if(inputRef.current){
      let len = inputRef.current.value.length - 1;
      inputRef.current.cols = Math.max(len, inputRef.current.placeholder.length - 2);
    }
  }


  return (
    <div ref={tagRef} className={classes.addtag} onClick={enterCreateMode}>

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
          ? <textarea
            ref={inputRef}
            type="text"
            onChange={adjustBoxWidth}
            onKeyDown={handleEnterKey}
            // onBlur={exitCreateMode}
            cols={'new tag'.length-2}
            maxLength={25}
            className={classes.text__input}
            placeholder='new tag'
          />

          : <p
            ref={inputRef}
            className={classes.text__fixed}
            >
              new tag
          </p>
        }
      </div>

    </div>
  );
}

export default AddTag;
