import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../store/auth-context';
import { makeGet, makePost, makePatch, makeDelete } from '../../tools/APIRequests'

export const useDisplayedUserModel = (userHandle) => {
  const ctx = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [displayedUser, setDisplayedUser] = useState()
  const [isOwner, setIsOwner] = useState()
  const [currentUserModified, setCurrentUserModified] = useState(false);


  // useEffect(() => {
  //   console.log('dum mounted')
  //   return () => console.log('dum unmounted')
  // }, [])


  // render displayed user from passed userHandle
  useEffect(() => {
    // console.log('userhandle/currentUser updated')
    grabUser()
  }, [userHandle, ctx.currentUser])


  // special case when the displayed user is the current user,
  //  and the current user has been updated
  useEffect(() => {
    const updateCurrentUser = async () => {
      if(currentUserModified){
        // console.log('currentUser updated')
        const result = await makeGet(`/users/${ctx.currentUser._id}`)
        if(result.user) setDisplayedUser(result.user)
        setCurrentUserModified(false)
      }
    }
    updateCurrentUser()
  }, [currentUserModified])


  // function called to make api request, fetching relevant user info
  //  by using the passed userHandle and the ctx from AuthContext
  const grabUser = async() => {
    setIsLoading(true);

    if(userHandle){
      const isOwnedTemp = (ctx.currentUser && ctx.currentUser.handle.toLowerCase() === userHandle.toLowerCase())

      const url = (isOwnedTemp)
        ? `/users/${ctx.currentUser._id}`
        : `/users/handle/${userHandle}`

      const result = await makeGet(url)
      if(result.user) {
        setDisplayedUser(result.user)
        setIsOwner(isOwnedTemp);
      }
      else {

      }
    }

    // simulate slow fetch
    setTimeout(() => { setIsLoading(false) }, 500);
  }


  // object of functions that will be passed to children
  //  if corresponding user is authorized. functions primarily used
  //  when the current user is logged in
  const authUserFunctions = {
    followUser: async (user) => {
      const result = await makePatch(`/users/${ctx.currentUser._id}`,
        {
          validation: { token: ctx.token, userId: ctx.currentUser._id },
          changes: { following: { follow: user._id } }
        }
      ).then((res) => res.json())

      if(!result.error) {
        // if displayed user is current user, update displayed user's following
        if(displayedUser._id === result.user._id)
          setDisplayedUser((prev) => {
            return { ...prev, following: result.user.following, }
          })

        // if displayed user is the resultant followed user, update displayed user's followers
        else if(displayedUser._id === result.followed._id)
          setDisplayedUser((prev) => {
            return { ...prev, followers: result.followed.followers,  }
          })
      }
      return result
    },

    unfollowUser: async (user) => {
      const result = await makePatch(`/users/${ctx.currentUser._id}`,
        {
          validation: { token: ctx.token, userId: ctx.currentUser._id },
          changes: { following: { unfollow: user._id } }
        }
      ).then((res) => res.json())

      if(!result.error) {
        // if displayed user is current user, update displayed user's following
        if(displayedUser._id === result.user._id)
          setDisplayedUser((prev) => {
            return { ...prev, following: result.user.following, }
          })

        // if displayed user is the resultant unfollowed user, update displayed user's followers
        else if(displayedUser._id === result.unfollowed._id)
          setDisplayedUser((prev) => {
            return { ...prev, followers: result.unfollowed.followers,  }
          })
      }
      return result
    }
  }


  // object of functions that will be passed to children
  //  if corresponding user is authorized. functions primarily used
  //  when the current user is logged in AND the displayed user
  //  is the current user AND the current user/displayed user is
  //  making changes to their lists
  const authListFunctions = {
    createList: async (listName) => {
      const result = await makePost(`/lists/`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          name: listName
        }
      ).then((res) => res.json())

      if(!result.error) setCurrentUserModified(true)
      return result;
    },

    changeListName: async (list, listName) => {
      const result = await makePatch(`/lists/${list._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          name: listName
        }
      ).then((res)=>res.json())

      if(!result.error) setCurrentUserModified(true)
      return result;
    },

    changeListPrivacy: async (list, setting) => {
      const result = await makePatch(`/lists/${list._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          privacy: setting
        }
      ).then((res)=>res.json())

      if(!result.error) setCurrentUserModified(true)
      return result
    },

    deleteList: async (list) => {
      const result = await makeDelete(`/lists/${list._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          name: list
        }
      ).then((res)=>res.json())

      if(!result.error) setCurrentUserModified(true)
      return result
    }
  }


  // object of functions that will be passed to children
  //  if corresponding user is authorized. functions primarily used
  //  when the current user is logged in AND the displayed user
  //  is the current user AND the current user/displayed user is
  //  making changes to their items
  const authItemFunctions = {
    createItem: async (list, item) => {
      const result = await makePost(`/items/`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          item: item
        }
      ).then((res) => res.json())

      if(!result.error) setCurrentUserModified(true)
      return result
    },

    updateItem: async (item) => {
      const result = await makePatch(`/items/${item._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          item: item
        }
      ).then((res) => res.json());

      if(!result.error) setCurrentUserModified(true)
      return result
    } ,

    deleteItem: async (item) => {
      const result = await makeDelete(`/items/${item._id}`,
        {
          validation: {token: ctx.token, userId: ctx.currentUser._id},
          item: item
        }
      ).then((res)=>res.json());

      if(!result.error) setCurrentUserModified(true)
      return result
    }

  }


  return {
    isLoading,
    isOwner,
    displayedUser,
    authFunctions: {
      userFunctions: (ctx.currentUser) ? authUserFunctions : null,
      listFunctions: (isOwner) ? authListFunctions : null,
      itemFunctions: (isOwner) ? authItemFunctions : null,
    },
    refreshModel: grabUser,
  }
}
