import { useRef } from 'react'
import { useOnClickOutside } from '../tools/CustomHooks';
import Button from './Button';
import classes from './WarningBox.module.scss';

function WarningBox(props) {
  const warningBoxRef = useRef(null);
  useOnClickOutside(warningBoxRef, props.onCancel)

  return (
      <div ref={warningBoxRef} className={classes.DeleteWarningBox}>
        <p>{props.warning}</p>
        <div className={classes.actions}>
          <Button classTypes={['end', 'dark']} onClick={props.onCancel}>
          {(props.cancel) ? props.cancel : 'cancel'}
          </Button>
          <Button classTypes={['end', 'dark', 'danger']} onClick={props.onConfirm}>
          {(props.submit) ? props.submit : 'confirm'}
          </Button>
        </div>
      </div>
  );
}

export default WarningBox;
