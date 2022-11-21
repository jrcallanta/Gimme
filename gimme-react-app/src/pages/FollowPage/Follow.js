import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { makePost } from "../../tools/APIRequests";
import { AuthContext } from "../../store/auth-context";
import UserBanner from "../../components/UserBanner";
import LoaderIcon from "../../components/LoaderIcon";

import classes from "./Follow.module.scss";

function FollowPage(props) {
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const tabs = [
        { id: "Following", to: `/${props.user.handle}/following` },
        { id: "Followers", to: `/${props.user.handle}/followers` },
    ];

    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [displayedList, setDisplayedList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        initializer(() => {
            setTimeout(() => setIsLoading(false), 200);
        });
    }, []);

    useEffect(() => {
        if (params && !isLoading) {
            const route = params["*"];
            if (route === "following") setDisplayedList(followingList);
            else if (route === "followers") setDisplayedList(followersList);
        }
    }, [params, isLoading]);

    const initializer = async (callback) => {
        const fromId = ctx.currentUser ? ctx.currentUser._id : null;

        const followingResult = props.user.following
            ? await makePost(`/users/idList`, {
                  idList: props.user.following,
                  fromId: fromId,
              }).then((res) => res.json())
            : [];
        const followersResult = props.user.followers
            ? await makePost(`/users/idList`, {
                  idList: props.user.followers,
                  fromId: fromId,
              }).then((res) => res.json())
            : [];
        await Promise.all([followingResult, followersResult]);

        console.log(followingResult, followersResult);

        const sortedFollowing = fromId
            ? putMutualsFirst(fromId, followingResult.userList)
            : followingResult.userList;
        const sortedFollowers = fromId
            ? putMutualsFirst(fromId, followersResult.userList)
            : followersResult.userList;
        if (!followingResult.error) setFollowingList(sortedFollowing);
        if (!followersResult.error) setFollowersList(sortedFollowers);

        if (callback) callback();
    };

    const putMutualsFirst = (userId, list) => {
        const followers_notFollowed = [];
        const followers_followed = [];
        const nonFollowers_notFollowed = [];
        const nonFollowers_followed = [];

        list.map((user) => {
            // if current user is followed by this user
            if (user.following.indexOf(userId) >= 0) {
                if (user.followers.indexOf(userId) >= 0)
                    followers_followed.push(user);
                else followers_notFollowed.push(user);
            }

            // if current user is not followed by this user
            else {
                if (user.followers.indexOf(userId) >= 0)
                    nonFollowers_followed.push(user);
                else nonFollowers_notFollowed.push(user);
            }
        });

        const result = [];
        result.push(
            ...followers_notFollowed,
            ...followers_followed,
            ...nonFollowers_followed,
            ...nonFollowers_notFollowed
        );

        return result;
    };

    const handleBack = () => {
        navigate("..");
    };

    const tabClass = (tab, isActive) => {
        return isActive
            ? `${classes.tabs__tab} ${classes.active}`
            : `${classes.tabs__tab}`;
    };

    return (
        <div className={classes.FollowPage}>
            <div className={classes.heading}>
                <div className={classes.backButton} onClick={handleBack}>
                    <div className={classes.backButton__icon}></div>
                </div>

                <div className={classes.userTitle} onClick={handleBack}>
                    <h2 className={classes.userTitle__username}>
                        {props.user.name}
                    </h2>
                    <h2 className={classes.userTitle__userhandle}>
                        @{props.user.handle}
                    </h2>
                </div>
            </div>

            <div className={classes.body}>
                <div className={classes.tabs}>
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.id}
                            tabIndex={"-1"}
                            to={tab.to}
                            replace={true}
                            className={({ isActive }) =>
                                tabClass(tab, isActive)
                            }
                        >
                            <h2>{tab.id}</h2>
                        </NavLink>
                    ))}
                </div>

                {isLoading ? (
                    <LoaderIcon />
                ) : displayedList && displayedList.length > 0 ? (
                    <div className={classes.listView}>
                        {displayedList.map((user) => (
                            <div
                                key={user.handle}
                                className={classes.listView__item}
                            >
                                <UserBanner
                                    user={user}
                                    navigateOnClick={true}
                                    showFollowStatus={true}
                                    authUserFunctions={props.authUserFunctions}
                                    block
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={classes.listView}>
                        <div className={classes.listView__empty}>
                            {params["*"] === "following" ? (
                                <h2>{`@${props.user.handle} is not currently following anyone`}</h2>
                            ) : (
                                <h2>{`@${props.user.handle} does not yet have any followers`}</h2>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FollowPage;
