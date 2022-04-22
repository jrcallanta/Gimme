import { useState, useEffect, useContext, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/auth-context';
import ToggleButton from './ToggleButton';
import classes from './UserBanner.module.scss';

function UserBanner(props) {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const followButtonRef = useRef(null);
  const [displayFollowStatus, setDisplayFollowStatus] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowedBy, setIsFollower] = useState(false);


  useEffect(() => {
    if(ctx.currentUser && ctx.currentUser._id !== props.user._id){
      const followingIndex = props.user.followers.indexOf(ctx.currentUser._id);
      const followedByIndex = props.user.following.indexOf(ctx.currentUser._id);
      setIsFollowing(followingIndex >= 0)
      setIsFollower(followedByIndex >= 0)
      setDisplayFollowStatus(true)
    }
    else {
      setIsFollowing(false)
      setIsFollower(false)
      setDisplayFollowStatus(false)
    }
  }, [props.user])


  const handleFollowToggle = async (event) => {
    if(props.authUserFunctions) {
      if(!isFollowing) {
        const result = await props.authUserFunctions.followUser(props.user)
        if(!result.error) setIsFollowing(true)
      }
      else {
        const result = await props.authUserFunctions.unfollowUser(props.user)
        if(!result.error) setIsFollowing(false)
      }
    }
  }

  const handleBannerClick = async (event) => {
    if(props.navigateOnClick) {
      navigate(`/${props.user.handle}`)
    }
  }


  return (
    <div
      className={classes.UserBanner}
      type={(props.block) ? 'block' : 'normal'}
      onClick={handleBannerClick}
      >

      <div className={classes.header}>
        <h2 className={classes.username}>{props.user.name}</h2>
        <NavLink to={`/${props.user.handle}`} tabIndex={'-1'}>
          <h2 className={classes.userhandle}>@{props.user.handle}</h2>
        </NavLink>
      </div>

      {props.showFollowStats &&
        <div className={classes.followStats}>
          <NavLink to={'../following'} tabIndex={'-1'}>
            <p className={classes.followStats__stat}>
              <span className={classes.followStats__stat__num}>{props.user.following.length}</span>
              <span className={classes.followStats__stat__label}>following</span>
            </p>
          </NavLink>

          <NavLink to={'../followers'} tabIndex={'-1'}>
            <p className={classes.followStats__stat}>
              <span className={classes.followStats__stat__num}>{props.user.followers.length}</span>
              <span className={classes.followStats__stat__label}>followers</span>
            </p>
          </NavLink>
        </div>
      }


      {displayFollowStatus &&
        <div className={classes.followStatus}>
          <div ref={followButtonRef}>
            <ToggleButton
              active={isFollowing}
              inactiveText={(isFollowedBy) ? 'Follow Back' : 'Follow'}
              activeText={'Following'}
              onToggle={handleFollowToggle}
            />
          </div>

          {isFollowedBy &&
            <ToggleButton
              fixed
              fixedText={'Follows You'}
              onToggle={null}
            />
          }
        </div>
      }

    </div>
  );
}

export default UserBanner;
