import React from 'react';
import { useRef } from 'react';
import { useOnPressEnterInFocused } from '../../../tools/CustomHooks'
import classes from './EditableText.module.scss';


// Functional component used specifically for the
//   name and the notes of a catalogue item. Could
//   possible break down further, turning the
//   h2/p tags into smaller components.
function EditableText(props) {
  const textareaRef = useRef(null);


  // Hook used to trigger state preservation and save
  //   on 'enter' keypress while inside textareaRef
  useOnPressEnterInFocused(textareaRef, ()=>{
    preserveEdit(()=>{
      props.onPreserveValue(props.itemKey, textareaRef.current.value);
      props.onSave();
    });
  });


  // Method called to preserve changes to text,
  //  changing itemState in parenting ItemModal.
  function preserveEdit(callback){
    textareaRef.current.value = textareaRef.current.value.trim();
    const newText = textareaRef.current.value;
    if(props.itemKey === 'name'){
      if(newText !== ''){
        callback();
      }
      else {
        textareaRef.current.value = textareaRef.current.placeholder;
      }
    }
    else {
      callback();
    }
  }

  // Method called to handle empty input,
  //   specifically for the notes text area
  function handleNotesChanged(){
    const input = textareaRef.current.value;
    if(input === '') {
      textareaRef.current.placeholder = 'Add notes';
    }
  }


  // Method called when an input/textarea
  //   loses focus, triggering state preservation
  function handleBlur(){
    preserveEdit(()=>{
      props.onPreserveValue(props.itemKey, textareaRef.current.value)
    });
  }


  // Method used to automatically adjust height of
  //   corresponding text area div when typing
  function changeBoxSize() {
    const e = document.querySelector(`.${classes.name__input}`)
    if(e){
      e.style.height = "1px";
      e.style.height = (e.scrollHeight)*1.01+"px";
    }
  }

  // Auto adjust textarea box
  if(props.isEditing){
    setTimeout(()=>{
      changeBoxSize();
    }, 0);
  }


  // If component being used for item name
  if (props.itemKey === 'name') {
    return (props.isEditing)
    ? <div className={classes.EditableName}>
        <textarea
          ref={textareaRef}
          onChange={changeBoxSize}
          onBlur={handleBlur}
          type="text"
          placeholder={props.text}
          defaultValue={props.text}
          className={classes.name__input}
          maxLength="50">
        </textarea>
    </div>

    : <div className={classes.EditableName}>
        <h2
          ref={textareaRef}
          className={classes.name__fixed}
          >{props.text}
        </h2>
    </div>
  }

  // else component being used for item notes
  else {
    return (props.isEditing)
    ? <div className={classes.EditableNotes}>
        <textarea
          ref={textareaRef}
          onKeyUp={changeBoxSize}
          onBlur={handleBlur}
          onChange={handleNotesChanged}
          type="text"
          placeholder={(props.text !== '') ? props.text : 'Add notes'}
          defaultValue={props.text}
          className={classes.notes__input}
          maxLength="1000">
        </textarea>
        <label className={classes.label__input}>Notes:</label>
    </div>

    : (props.text)
      ? <div className={classes.EditableNotes}>
          <p
            ref={textareaRef}
            className={classes.notes__fixed}>{props.text}</p>
          <label className={classes.label__fixed}>Notes:</label>
      </div>

      : ''
  }
}

export default EditableText;
