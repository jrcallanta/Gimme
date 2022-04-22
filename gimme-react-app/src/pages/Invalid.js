import classes from './Invalid.module.scss';

function InvalidPage(props) {


  return (
    <div className={classes.InvalidPage}>
      <h2 className={classes.heading}>
        {props.heading || 'Page Does Not Exist'}
      </h2>

      <p className={classes.body}>
        {props.body || 'The page you are looking for could not be found. Please look elsewhere.'}
      </p>
    </div>
  );
}

export default InvalidPage;
