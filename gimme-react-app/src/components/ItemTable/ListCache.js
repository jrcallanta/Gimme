import { useState } from 'react'

export const useListCache = (lists) => {
  const [itemListCache, setItemListCache] = useState({})

  const addToCache = (list, items) => {
    setItemListCache((prev) => {
      prev[list._id] = items;
      return prev
    })
  }

  const clearList = (list) => {
    setItemListCache((prev) => {
      if(list._id){
        prev[list._id] = undefined;
        prev[null] = undefined;
        return prev
      }

      return {}
    })
  }

  return {
    listCache: itemListCache,
    addToCache: addToCache,
    clearList: clearList,
  }
}
