import classes from './NewItemCard.module.scss';

function NewItemCard(props) {

  return (
    <div className={classes.NewItemCard} onClick={props.onClick}>
      <div className={classes.plusButton}>
        <div className={classes.plusButton__icon}></div>
      </div>

      <h3 className={classes.name}>{props.label}</h3>
    </div>
  );
}

export default NewItemCard;
