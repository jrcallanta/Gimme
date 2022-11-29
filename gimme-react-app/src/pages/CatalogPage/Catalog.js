import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ItemTableWithCache from "../../components/ItemTable/ItemTableWithCache";
import UserBanner from "../../components/UserBanner";
import ListNav from "./ListNav";
import CreateListView from "./CreateListView";
import InvalidPage from "../Invalid";

import classes from "./Catalog.module.scss";

// REQUIRED PROPS {
//   user: [{...userSchema}],
//   isOwner : bool,
//   authUserFunctions : {}
//   authListFunctions : {}
//   authItemFunctions : {}
// }
function CatalogPage(props) {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newList, setNewList] = useState(null);

    useEffect(() => {
        const refresh = async () => {
            setIsLoading(true);
            await refreshLists();
            setIsLoading(false);
        };
        refresh();
    }, []);

    useEffect(() => {
        refreshLists();
    }, [props.user.lists]);

    const refreshLists = async (callback) => {
        const lists = await prepareLists();
        setLists(lists);

        if (callback) callback();
    };

    const prepareLists = async () => {
        const allItems = {
            _id: null,
            name: "All Items",
            listItems: [],
        };

        const lists = props.user.lists;
        lists.forEach((list) => {
            list.listItems.forEach((item) => {
                allItems.listItems.push(item);
            });
        });

        const allLists = lists.slice();
        allLists.unshift(allItems);
        return allLists;
    };

    const createList = async (listName) => {
        if (props.authListFunctions) {
            const result = await props.authListFunctions.createList(listName);
            setNewList(null);

            // this block is to keep changes if valid while task executes,
            //   otherwise, it redirects to nonexistant list until prop is updated
            if (!result.error) {
                setNewList(result.list);
                await refreshLists();
                navigate(`${result.list._id}`);
            }
            return result;
        }
    };

    const changeListName = async (list, listName) => {
        if (list._id && props.authListFunctions) {
            const result = await props.authListFunctions.changeListName(
                list,
                listName
            );

            // this block is to keep changes if valid while task executes,
            //   otherwise, it resets to the original name until prop is updated
            if (!result.error) {
                setLists((prevLists) => {
                    prevLists.find((l) => l._id === list._id).name = listName;
                    return prevLists;
                });
                refreshLists();
            }
            return result;
        }
    };

    const changeListPrivacy = async (list, setting) => {
        if (list._id && props.authListFunctions) {
            const result = await props.authListFunctions.changeListPrivacy(
                list,
                setting
            );

            // this block is to keep changes if valid while task executes,
            //   otherwise, it resets to the original name until prop is updated
            if (!result.error) {
                setLists((prevLists) => {
                    prevLists.find((l) => l._id === list._id).privacy = setting;
                    return prevLists;
                });
                refreshLists();
            }
            return result;
        }
    };

    const deleteList = async (list) => {
        if (list._id && props.authListFunctions) {
            const result = await props.authListFunctions.deleteList(list);

            if (!result.error) {
                navigate(`/${props.user.handle}/lists/all-items`, {
                    replace: true,
                });
                refreshLists();
            }
        }
    };

    return (
        <div className={classes.Catalogue}>
            <div className={classes.SidePanel}>
                <UserBanner
                    user={props.user}
                    showFollowStats={true}
                    showFollowStatus={true}
                    authUserFunctions={props.authUserFunctions}
                />

                <ListNav isOwner={props.isOwner} lists={lists} />
            </div>

            <div className={classes.MainDisplay}>
                <Routes>
                    <Route path='/'>
                        {
                            // Route only available to owner of catalog
                            props.isOwner && (
                                <Route
                                    path='create-list'
                                    exact
                                    element={
                                        <CreateListView
                                            onCreateList={createList}
                                        />
                                    }
                                ></Route>
                            )
                        }

                        {
                            // Route for each retrieved list (public/private/etc)
                            lists.map((list, i) => (
                                <Route
                                    path={
                                        list._id ? `${list._id}` : "all-items"
                                    }
                                    key={i}
                                    exact
                                    element={
                                        <ItemTableWithCache
                                            user={props.user}
                                            isEditable={props.isOwner}
                                            list={list}
                                            authItemFunctions={
                                                props.authItemFunctions
                                            }
                                            onChangeListName={(newName) =>
                                                changeListName(list, newName)
                                            }
                                            onChangeListPrivacy={(setting) =>
                                                changeListPrivacy(list, setting)
                                            }
                                            onDeleteList={() =>
                                                deleteList(list)
                                            }
                                        />
                                    }
                                />
                            ))
                        }

                        <Route
                            path=''
                            element={<Navigate to='all-items' />}
                            replace={true}
                        />
                        <Route
                            path='*'
                            element={
                                isLoading || newList ? (
                                    <InvalidPage heading={" "} body={" "} />
                                ) : (
                                    <InvalidPage
                                        heading={"List Does Not Exist"}
                                        body={
                                            "The list you're looking for is not available. Please look elsewhere."
                                        }
                                    />
                                )
                            }
                            replace={true}
                        />
                    </Route>
                </Routes>
            </div>
        </div>
    );
}

export default CatalogPage;
