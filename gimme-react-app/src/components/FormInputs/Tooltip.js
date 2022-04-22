import { useState, useEffect } from 'react';

import classes from './Tooltip.module.scss';

function Tooltip(props) {
  const [showTip, setShowTip] = useState(!!props.displayTip)

  useEffect(() => {
    setShowTip(props.displayTip)
  }, [props.displayTip])

  const toggleShowTip = () => {
    setShowTip((prev) => !prev)
  }

  return (
    <div className={classes.Tooltip}>
      <div className={classes.Tooltip__button} onClick={toggleShowTip}>i</div>
      {showTip && <div className={classes.Tooltip__tip}>{props.tip}</div>}
    </div>
  )
}

export default Tooltip;
