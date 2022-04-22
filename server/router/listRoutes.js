module.exports = (data) => {
  console.log('requiring list routes...')

  const express = require('express')
  const app = express.Router();

  app.route('/users/:userId/lists')
    .get((req, res) => {
      console.log('api: USERS/USER.ID/LISTS -> GET');
      const { userId } = req.params;

      data.ItemList.find({
        userId: userId
      }, (listsFindError, foundLists) => {
        if(listsFindError) res.status(400).send({
          message: `Could not find lists for user ${userId}`,
          error: listsFindError,
        })

        else res.status(200).send({
          message: `Successfully retrieved all lists for user ${userId}`,
          lists: foundLists
        })
      })
    })



  app.route('/lists/')
    .post(async (req, res) => {
      console.log('api: LISTS -> POST')
      const { validation, name, privacy, admin } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession && !admin) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      data.User.findById(validation.userId, async (userFindError, foundUser) => {
        if(userFindError || !foundUser) {
          res.status(400).send({
            message: `Could not find user ${validation.userId}`,
            error: userFindError
          })
          return;
        }

        // handle list-name (must be unique to user)
        const query = await data.ItemList.find({ userId: foundUser._id, name: name }).exec();
        if(query.length) res.status(200).send({
            message: `'${name}' already exists`,
            error: {},
        })


        else {
          const newList = new data.ItemList({
            userId: foundUser._id,
            name: name,
            privacy: (privacy) ? privacy : 'PUBLIC',
            listItems: []
          })
          newList.save(async (listSaveError) => {
            if(!listSaveError) {
              foundUser.statistics.totalLists++;
              foundUser.markModified('statistics');
              await foundUser.save()
              res.status(200).send({
                message: 'Successfully created list',
                list: newList
              });
            }
            else res.status(400).send({
              message: `Could not create list`,
              error: listSaveError
            })
          })
        }
      })
    });



  app.route('/lists/:listId')
    .get((req, res) => {
      console.log('api: /LISTS/LIST.ID -> GET')
      const { listId } = req.params;

      data.ItemList.findById(listId, (listFindError, foundList) => {
        if(listFindError || !foundList) res.status(400).send({
          message: `Could not find list ${listId}`,
          error: {}
        })

        else res.status(200).send({
          message: `Succesfully retrieved list ${foundList._id}`,
          list: foundList
        })
      });
    })

    .patch(async (req, res) => {
      console.log('api: /LISTS/LIST.ID -> PATCH')
      const { listId } = req.params;
      const { validation, name, admin } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession && !admin) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      data.ItemList.findById(listId, async (listFindError, foundList) => {
        if(listFindError || !foundList) res.status(400).send({
          message: `Could not find list ${listId}`,
          error: {}
        })

        else if(foundList.userId.valueOf() !== validation.userId) {
          res.status(400).send({
            message: `The list ${listId} does not belong to you`,
            error: {}
          })
        }

        else {
          // handle specific list-name change (must be unique to user)
          const query = await data.ItemList.find({ userId: foundList.userId, name: name }).exec();
          if(query.length) res.status(200).send({
              message: `'${name}' already exists`,
              error: {},
          });

          else {
            await Promise.all(
              Object.entries(req.body).map(([k,v]) => {
                foundList[k] = v;
                foundList.markModified(k)
              })
            )
            await foundList.save()
            res.status(200).send({
              message: `Succesfully updated list ${foundList._id}`,
              list: foundList
            })
          }
        }
      });
    })


    .delete(async (req, res) => {
      console.log('api: /LISTS/LIST.ID -> DELETE')
      const { listId } = req.params;
      const { validation } = req.body;

      // only perform task if signed in
      const validSession = await data.validateSession(validation)
      if(!validSession && !admin) {
        res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      data.ItemList.findById(listId, (listFindError, foundList) => {
        if(listFindError || !foundList) res.status(400).send({
          message: `Could not find list ${listId}`,
          error: {}
        })

        else if (foundList.userId.valueOf() !== validation.userId) {
          res.status(400).send({
            message: `The list ${listId} does not belong to you`,
            error: {}
          })
        }

        else {
          data.ItemList.findByIdAndRemove(listId, async(listRemoveError, removedList) => {
            if(listRemoveError || !removedList) res.status(400).send({
              message: `Could not delete list ${listId}`,
              error: listRemoveError
            })

            else {
              let removedCount = 0;
              await Promise.all(removedList.listItems.map(async(item) => {
                await data.Item.findByIdAndRemove(item)
                removedCount++;
              }))

              const options = { new: true, runValidators: true };
              data.User.findByIdAndUpdate(removedList.userId,
                { $inc: {
                  'statistics.totalLists': -1,
                  'statistics.totalItems': -1 * removedCount
                } },
                options,
                (userUpdateError, updatedUser) => {
                  if(userUpdateError || !updatedUser) res.status(400).send({
                    message: `Could not update user ${removedList.userId}`,
                    error: userUpdateError,
                  })

                  else res.status(200).send({
                    message: `Succesfully updated user ${updatedUser._id}`,
                    user: updatedUser
                  })
                }
              );
            }
          });
        }
      })
    })

  return app;
}
