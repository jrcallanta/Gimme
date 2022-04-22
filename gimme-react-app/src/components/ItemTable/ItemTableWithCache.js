import {
  useListCache
} from './ListCache'

import ItemTableOG from './ItemTable';

function ItemTableWithCache(props) {
  const { listCache, addToCache, clearList } = useListCache();

  return (
    <ItemTableOG
      user={props.user}
      isEditable={props.isEditable}
      list={props.list}
      items={listCache[props.list._id]}
      addToCache={addToCache}
      clearList={clearList}
      authItemFunctions={props.authItemFunctions}
      onChangeListName={props.onChangeListName}
      onChangeListPrivacy={props.onChangeListPrivacy}
      onDeleteList={props.onDeleteList}
    />
  );
}

export default ItemTableWithCache;
