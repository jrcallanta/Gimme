module.exports = (data) => {
  console.log('requiring item routes...')

  const express = require('express')
  const app = express.Router()

  app.route('/users/:userId/items')
    .get(async (req, res) => {
      console.log('api: USERS/USER.ID/ITEMS -> GET')

      const { userId } = req.params;
      const userQuery = await data.User.find({_id: userId}).exec()
      if(userQuery.length) {
        const itemsQuery = await data.Item.find({userId: userId}).exec()
        res.status(200).send({
          message: `Retrieved ${itemsQuery.length} items from user ${userId}`,
          items: itemsQuery
        })
      }

      else res.status(400).send({
        message: `Could not find user ${userId}`,
        error: {}
      })
    })



  app.route('/users/handle/:userHandle/items')
    .get(async (req, res) => {
      console.log('api: USERS/USER.HANDLE/ITEMS -> GET')

      const { userHandle } = req.params;
      const userQuery = await data.User.find({handle: userHandle}).exec();
      if(userQuery.length) {
        const publicListsQuery = await data.ItemList.find(
          {userId: userQuery[0]._id, privacy: 'PUBLIC'}
        ).exec();
        const allPublicItems = []
        await Promise.all( publicListsQuery.map(async (list) => {
          await Promise.all( list.listItems.map(async (id) => {
            const item = await data.Item.findById(id);
            allPublicItems.push(item)
          }))
        }))
        allPublicItems.sort((a,b) => a.lastUpdate - b.lastUpdate)
        res.status(200).send({
          message: `Retrieved ${allPublicItems.length} items for user @${userHandle}`,
          items: allPublicItems
        })
      }
    })



  app.route('/lists/:listId/items')
    .get((req, res) => {
      console.log('api: LISTS/LIST.ID/ITEMS -> GET')

      const { listId } = req.params;
      data.ItemList.findById( listId, (listFindError, listFound) => {
        if(listFound){
          data.Item.find(
            {listId: listFound._id.valueOf()},
            (itemsFindError, foundItems) => {
              if(foundItems) res.status(200).send({
                message: `Retrieved ${foundItems.length} items with listId '${listId}'`,
                items: foundItems
              })

              else res.status(400).send({
                message: `Could not find items`,
                error: itemsFindError
              })
            }
          )
        } else res.status(400).send({
          message: `Could not find list '${listId}'`,
          error: listFindError
        })
      })
    })


  app.route('/items/')
    .post(async (req, res) => {
      console.log('api: LISTS/LIST.ID/ITEMS -> POST')
      const { validation, item } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      else {
        data.User.findById(validation.userId, async(userFindError, foundUser) => {
          if(userFindError || !foundUser) res.status(400).send({
            message: `Could not find user ${validation.userId}`,
            error: userFindError
          })

          else {
            data.ItemList.findById(item.listId, async(listFindError, foundList) => {
              if(listFindError || !foundList) res.status(400).send({
                message: `Could not find list ${item.listId}`,
                error: listFindError
              })

              else if(foundList.userId.valueOf() !== validation.userId) {
                res.status(400).send({
                  message: `The list ${item.listId} does not belong to you`,
                  error: {}
                })
              }

              else {
                const now = new Date();
                const newItem = new data.Item({
                  ...item,
                  userId: foundList.userId,
                  listId: foundList._id,
                  dateCreated: now,
                  lastUpdate: now
                });
                await newItem.save();

                foundList.listItems.push(newItem._id);
                foundList.markModified('listItems');
                foundList.lastUpdate = now;
                foundList.markModified('lastUpdate');
                await foundList.save()

                foundUser.statistics.totalItems++;
                foundUser.markModified('statistics.totalItems')
                await foundUser.save();

                res.status(200).send({
                  message: `Succesfully added item ${newItem._id}`,
                  item: newItem,
                  list: foundList,
                  user: foundUser,
                })
              }
            })
          }
        })
      }
    })

  app.route('/items/:itemId')
    .get(async (req, res) => {
      console.log('api: ITEMS/ITEM.ID -> GET')
      const { itemId } = req.params;

      data.Item.findById(itemId, async(itemFindError, foundItem) => {
        if(itemFindError || !foundItem) res.status(400).send({
          message: `Could not find item ${itemId}`,
          error: itemFindError
        })

        else res.status(200).send({
          message: `Succesfully retrieved item ${foundItem._id}`,
          item: foundItem
        })
      })
    })

    .patch(async (req, res) => {
      console.log('api: ITEMS/ITEM.ID -> PATCH')
      const { itemId } = req.params;
      const { validation, item } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      data.ItemList.findById(item.listId, (listFindErr, foundList) => {
        if(listFindErr || !foundList) res.status(400).send({
          message: `Could not find list ${item.listId}`,
          error: listFindErr
        })

        else if (foundList.userId.valueOf() !== validation.userId) {
          res.status(400).send({
            message: `The list ${item.listId} does not belong to you`,
            error: {}
          })
        }

        else {
          const now = new Date();
          const options = {new: true, runValidators: true};
          data.Item.findByIdAndUpdate(itemId,
            {$set:
              {...item,
                lastUpdate: now
              }
            }, options,
            async (itemUdpateError, updatedItem) => {
              if(itemUdpateError || !updatedItem) res.status(400).send({
                message: `Could not update item ${itemId}`,
                error: itemUdpateError
              })

              else {
                foundList.lastUpdate = now;
                foundList.markModified('lastUpdate');
                await foundList.save()

                res.status(200).send({
                  message: `Succesfully updated item`,
                  item: updatedItem,
                  list: foundList
                })
              }
            }
          )
        }
      })

    })

    .delete(async (req, res) => {
      console.log('api: ITEMS/ITEM.ID -> DELETE')
      const { itemId } = req.params;
      const { validation, item } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      data.User.findById(item.userId, async(userFindError, foundUser) => {
        if(userFindError || !foundUser) res.status(400).send({
          message: `Could not find user ${item.userId}`,
          error: userFindError
        })

        else {
          data.ItemList.findById(item.listId, async(listFindError, foundList) => {
            if(listFindError || !foundList) res.status(400).send({
              message: `Could not find list ${item.listId}`,
              error: listFindError
            })

            else if (foundList.userId.valueOf() !== validation.userId) {
              res.status(400).send({
                message: `The list ${item.listId} does not belong to you`,
                error: {}
              })
            }

            else {
              data.Item.findByIdAndRemove(item._id, async (itemRemoveError, removedItem) => {
                if(itemRemoveError || !removedItem) res.status(400).send({
                  message: `Could not delete item ${item}`,
                  error: itemRemoveError
                })

                else {
                  const now = new Date();
                  const index = foundList.listItems.indexOf(removedItem._id)
                  foundList.listItems.splice(index, 1);
                  foundList.markModified('listItems');
                  foundList.lastUpdate = now;
                  foundList.markModified('lastUpdate')
                  await foundList.save()

                  foundUser.statistics.totalItems--;
                  foundUser.markModified('statistics.totalItems')
                  await foundUser.save()

                  res.status(200).send({
                    message: `Succesfully deleted item ${removedItem._id}`,
                    list: foundList,
                    user: foundUser
                  })
                }
              })
            }
          })
        }
      })
    })

  return app;
}
