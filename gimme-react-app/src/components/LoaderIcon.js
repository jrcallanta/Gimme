
import classes from './LoaderIcon.module.scss';

function LoaderIcon() {
  return (
    <div className={classes.LoaderIcon}>
      <div className={classes.LoaderIcon__icon}>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoaderIcon;
