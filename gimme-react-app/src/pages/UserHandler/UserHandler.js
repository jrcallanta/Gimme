import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useDisplayedUserModel } from './DisplayedUserModel';

import InvalidPage from '../Invalid';
import CatalogPage from '../CatalogPage/Catalog';
import LoaderIcon from '../../components/LoaderIcon';


// Lazy Loading
const FollowPage = React.lazy(() => import('../FollowPage/Follow'));


function UserHandler(props) {
  const { userHandle } = useParams();
  const {
    isLoading,
    displayedUser,
    isOwner,
    authFunctions,
    refreshModel
  } = useDisplayedUserModel(userHandle)


  useEffect(() => {
    // console.log('displayedUser updated')
  }, [displayedUser])


  if(isLoading)
    return <LoaderIcon/>

  else if(!displayedUser)
    return <InvalidPage
      heading={`User Does Not Exist`}
      body={`The user @${userHandle} does not currently exist. Please look elsewhere.`}
    />

  else
    return <Suspense fallback={<LoaderIcon/>}>

      <Routes>
        <Route path="/">
          <Route path="" element={<Navigate to={'lists/all-items'} replace={true}/>}/>

          <Route path="lists/*" element={
            <CatalogPage
              user={displayedUser}
              isOwner={isOwner}
              authUserFunctions={authFunctions.userFunctions}
              authListFunctions={authFunctions.listFunctions}
              authItemFunctions={authFunctions.itemFunctions}
            />
          } />

          <Route path="followers" element={
            <FollowPage
              user={displayedUser}
              authUserFunctions={authFunctions.userFunctions}
            />
          } />

          <Route path="following" element={
            <FollowPage
              user={displayedUser}
              authUserFunctions={authFunctions.userFunctions}
            />
          } />

          <Route path="*" element={
            <InvalidPage
              heading={`Page Does Not Exist`}
              body={`The page you're looking for does not currently exist. Please look elsewhere.`}
            />
          }/>
        </Route>
      </Routes>

    </Suspense>
}

export default UserHandler;
