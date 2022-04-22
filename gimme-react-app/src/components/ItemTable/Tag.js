import classes from './Tag.module.scss';

// Tag Component used to display tags
// in parenting ItemTable Component
//
// REQUIRED PROPS {
//   isActive : bool,
//   onClick : func
//   showFreq : bool
// }
function Tag(props) {

  function toggleHandler() {
    props.onClick()
  }

  return (
    <div
      className={(props.isActive) ? `${classes.Tag} ${classes.Tag__active}` : `${classes.Tag}`}
      onClick={toggleHandler}>
      {
        (props.showFreq)
          ? `${props.tag} (${props.showFreq})`
          : `${props.tag}`
      }
    </div>
  );
}

export default Tag;
