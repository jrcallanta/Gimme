import { useState, useEffect, useRef } from 'react'

import classes from './ToggleButton.module.scss'

function ToggleButton(props) {
  const buttonRef = useRef(null)
  const [active, setActive] = useState(props.active)
  const [text, setText] = useState(props.fixedText)

  useEffect(() => {
    setActive(props.active)
  }, [props.active])

  useEffect(() => {
    if(active) setText(props.activeText)
    else if(props.inactiveText) setText(props.inactiveText)
    else setText(props.fixedText)
  }, [active])

  const handleClick = (event) => {
    event.stopPropagation();
    if(props.onToggle){
      const loadingText = (props.loadingText) ? props.loadingText : 'updating...'
      setText(loadingText)
      props.onToggle()      
    }
  }

  return (
    <div
    ref={buttonRef}
    onClick={handleClick}
    type={(props.fixed) ? 'fixed' : 'normal'}
    className={(active)
      ? `${classes.ToggleButton} ${classes.active}`
      : classes.ToggleButton
    }>
    {text}
    </div>
  );
}
export default ToggleButton;
