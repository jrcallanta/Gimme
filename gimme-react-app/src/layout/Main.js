import { Outlet } from 'react-router-dom'
import classes from './Main.module.scss';
function Main(props) {

  return (
    <div className={classes.Main}>
      <Outlet/>
    </div>
  )
}

export default Main;
