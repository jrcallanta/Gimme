const express = require('express')

module.exports = (data) => {
  const app = express.Router();

  app.route('/users/')
    .post(async (req, res) => {
      console.log('api: USERS -> POST')
      const { name, handle, email, password } = req.body;
      const userHandleQuery = data.User.find({handle: {$regex: `^${handle}$`, $options: 'i'}}).exec();
      const userEmailQuery = data.User.find({email: {$regex: `^${email}$`, $options: 'i'}}).exec();

      const allPromises = await Promise.all([userHandleQuery, userEmailQuery]);

      // Check if username & email inputs are not yet registered
      const errors = {}
      if(allPromises[0].length){
        errors.username = {
          message: `The username '${handle}' is already in use. Try another.`,
          error: {}
        }
      }
      if(allPromises[1].length)
        errors.email = {
          message: `The email '${email}' is already registered. Try another.`,
          error: {}
        }

      if(errors.username ||errors.email) res.status(400).send({
        message: `Could not save user`,
        error: errors
      })


      // else if not registered
      else {
        const now = new Date();
        const hash = await data.bcrypt.hash(password);
        const newUser = new data.User({
          ...req.body,
          password: hash,
          activity: {
            dateCreated: now,
            lastSeen: now,
          }
        });

        await newUser.save((userSaveError) => {
          if(userSaveError) res.status(400).send({
            message: `Could not save user`,
            error: userSaveError
          })
          else res.status(200).send({
            message: `Succesfully created user ${handle}`,
            user: {
              _id: newUser._id,
              name: newUser.name,
              handle: newUser.handle,
              email: newUser.email,
              activity: newUser.activity,
              statistics: newUser.statistics,
              following: newUser.following,
              followers: newUser.followers
            }
          })
        });
      }
    })


  app.route('/users/handle/:userHandle')
    .get((req, res) => {
      console.log('api: USERS/HANDLE/USER.HANDLE -> GET')

      const { userHandle } = req.params;
      data.User.find({
        handle: {$regex: `^${userHandle}$`, $options: 'i'}
      }, async (userFindError, foundUser) => {
        if(userFindError || !foundUser.length) res.status(400).send({
          message: `Could not find user '${userHandle}'`,
          error: userFindError
        })

        else {
          const lists = await data.ItemList.find({
            userId: foundUser[0]._id,
            privacy: 'PUBLIC'
          }).exec();

          res.status(200).send({
            message: `Succesfully found user '${foundUser[0].handle}'`,
            user: {
              _id: foundUser[0]._id,
              name: foundUser[0].name,
              handle: foundUser[0].handle,
              activity: foundUser[0].activity,
              statistics: foundUser[0].statistics,
              following: foundUser[0].following,
              followers: foundUser[0].followers,
              lists: lists,
            }
          })
        }
      })
    })



  app.route('/users/idList')
    .post(async (req, res) => {
      console.log('api: USERS/IDLIST')

      const { idList } = req.body;

      const errors = [];
      let userList = []

      if(!idList) {
        console.log(idList)
        res.status(400).send({
          message: `Please provide an idList`,
          error: {},
          userList: userList
        });
        return;
      }

      await Promise.all(
        idList.map(async (id) => {
          const user = await data.User.findById(id, '_id name handle following followers').exec()

          if(!user)
            errors.push({_id: id, message: `Could not find user`, error: {}})
          else
            userList.push(user)
        })
      )

      if(userList) userList.sort((user1, user2) => {
        if(user1.handle > user2.handle) return 1;
        else if (user1.handle < user2.handle) return -1;
        else return 0;
      })

      if(errors.length) res.status(400).send({message: 'Could not find some users', error: errors, userList: userList})
      else res.status(200).send({message: `Succesfully found all users`, userList: userList})
    })



  app.route('/users/:userId')
    .get((req, res) => {
      console.log('api: USERS/USER.ID -> GET')

      const { userId } = req.params;
      data.User.findById(userId, async (userFindError, foundUser) => {
        if(userFindError || !foundUser) res.status(400).send({
          message: `Could not find user ${userId}`,
          error: userFindError
        })

        else {
          const lists = await data.ItemList.find({
            userId: foundUser._id,
          }).exec();

          res.status(200).send({
            message: `Succesfully retrieved user ${foundUser._id}`,
            user: {
              _id: foundUser._id,
              name: foundUser.name,
              handle: foundUser.handle,
              activity: foundUser.activity,
              statistics: foundUser.statistics,
              following: foundUser.following,
              followers: foundUser.followers,
              lists: lists,
            }
          })
        }
      })
    })

    .patch(async(req, res) => {
      console.log('api: USERS/USER.ID -> PATCH')

      const { userId } = req.params;
      const { validation, changes, admin } = req.body;

      const validSession = await data.validateSession(validation)
      if(!validSession && !admin) {
          res.status(400).send({
          message: `You must be signed in to perform this command`,
          error: {}
        });
        return;
      }

      const user = await data.User.findById(validation.userId)
        .select('+password')
        .exec();

      if(!user) {
        res.status(400).send({
          message: `Could not find user ${userId}`,
          error: {}
        })
        return;
      }

      if(changes.password){
        const compare = await data.bcrypt.compare(changes.password.oldPassword, user.password)
        if(compare){
          const hash = await data.bcrypt.hash(changes.password.newPassword);
          user.password = hash;
          user.markModified('password');
          await user.save()
          res.status(200).send({
            message: `Succesfully updated user ${userId}`,
            user: user
          })
        }
        else res.status(200).send({
          message: `Incorrect password`,
          error: {}
        })
      }


      else if(changes.handle){
        const userQuery = await data.User.find({handle: {$regex: `^${changes.handle}$`, $options: 'i'}}).exec()
        if(userQuery.length && userQuery[0]._id.valueOf() !== user._id.valueOf()) res.status(200).send({
          message: `The username ${changes.handle} is currently unavailable`,
          error: {}
        })

        else {
          user.handle = changes.handle;
          user.markModified('handle');
          user.save((userSaveError) => {
            if(userSaveError) res.status(200).send({
              message: userSaveError.errors.handle.message,
              error: userSaveError
            })

            else res.status(200).send({
              message: `Succesfully updated user`,
              user: user
            })

          })
        }
      }


      else if(changes.following) {
        if(changes.following.follow){
          const id = changes.following.follow;
          data.User.findById(id, async (userFindError, foundUser) => {
            if(userFindError || !foundUser) res.status(400).send({
              message: `Could not find user ${id}`,
              error: userFindError
            })

            else {
              foundUser.followers.push(user._id)
              foundUser.markModified('followers')
              await foundUser.save()

              user.following.push(changes.following.follow)
              user.markModified('following')
              await user.save()

              res.status(200).send({
                message: `Succesfully followed user ${foundUser._id}`,
                user: user,
                followed: foundUser
              })
            }
          });
        }
        else if(changes.following.unfollow){
          const id = changes.following.unfollow;
          data.User.findById(id, async (userFindError, foundUser) => {
            if(userFindError || !foundUser) res.status(400).send({
              message: `Could not find user ${id}`,
              error: userFindError
            })

            else {
              // remove this user from the followers of the other user
              let ind = foundUser.followers.indexOf(user._id)
              if(ind >= 0) {
                foundUser.followers.splice(ind, 1);
                foundUser.markModified('followers');
                await foundUser.save()
              }

              // remove other user from the following of this user
              ind = user.following.indexOf(foundUser._id)
              if(ind >= 0) {
                user.following.splice(ind, 1);
                user.markModified('following')
                await user.save()
              }

              res.status(200).send({
                message: `Succesfully unfollowed user ${foundUser._id}`,
                user: user,
                unfollowed: foundUser
              })
            }
          })
        }
      }

      else {
        const options = { new: true, runValidators: true };
        data.User.findByIdAndUpdate(userId, changes, options,
        (userUpdateError, updatedUser) => {
          if(userUpdateError || !updatedUser) res.status(400).send({
            message: `Could not update user`,
            error: userUpdateError
          })

          else res.status(200).send({
            message: `Succesfully updated user`,
            user: updatedUser
          })
        });
      }
    });

    return app;
}
