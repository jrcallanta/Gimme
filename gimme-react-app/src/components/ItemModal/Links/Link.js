import classes from './Link.module.scss';

function Link(props) {

  return (
    <div className={classes.link}>
      {props.isEditing && <span className={classes.link__removeButton} onClick={props.onRemove}>remove</span>}
      <span className={classes.link__link}>
        <a href={props.link} target='_blank' rel='noreferrer'>{props.link}</a>
      </span>

    </div>
  );
}

export default Link;
