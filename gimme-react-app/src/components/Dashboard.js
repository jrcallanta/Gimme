import classes from './Dashboard.module.scss';

// Dashboard method used primarily to hold entire
//  webapp in a styled glassmorphic modal/site
function Dashboard(props) {
  return (
    <div className={classes.Dashboard} type={props.type}>
      {props.children}
    </div>
  );
}

export default Dashboard;
