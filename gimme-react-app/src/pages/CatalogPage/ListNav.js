import { NavLink } from 'react-router-dom';

import classes from './ListNav.module.scss';

function ListNav(props) {

  const newListButtonClass = ({isActive}) => {
    return (isActive)
      ? `${classes.NewListButton} ${classes.selected}`
      : `${classes.NewListButton}`
  }

  const navListClass = ({isActive}) => {
    return (isActive)
      ? `${classes.navLink} ${classes.selected}`
      : `${classes.navLink}`
  }

  return (
    <div className={classes.ListNav}>
      {props.isOwner &&
        <NavLink
          to={`create-list`}
          className={newListButtonClass}
          > Create New List </NavLink>
      }

      <div className={classes.navLinks}>
          {
            props.lists.map((list,i) => {
              const to = (i > 0)
                ? `${list._id}`
                : `all-items`

              return <NavLink key={i} to={to} className={navListClass}>
                <p className={classes.navLink__text}>{list.name}</p>
                {list.privacy === "PRIVATE" && <div className={classes.privateIcon}>
                  <div className={classes.icon}></div>
                </div>}
              </NavLink>
            })
          }
      </div>
    </div>
  );
}

export default ListNav;
