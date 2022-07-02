
/*** HELPER FUNCS AND CONSTANTS *************************************/


const DAY_IN_MILLIS = 1000 * 3600 * 24;


const createSession = async (data, userId) => {
  const randSaltRound = Math.floor(Math.random() * 10);
  const token = await data.bcrypt.hash(userId.valueOf(), randSaltRound)
  const sessionQuery = await data.Session.find({userId: userId}).exec();
  if(sessionQuery.length) {
    const session = sessionQuery[0]
    session.token = token;
    session.markModified('token')

    const expiration = new Date(Date.now() + (7 * DAY_IN_MILLIS));
    session.expiration = expiration
    session.markModified('expiration')

    await session.save();
    return session.token
  }


  // Maintaining database when active
  data.dropExpiredSessions();


  const newSession = new data.Session({
    userId: userId,
    token: token,
    expiration: new Date(Date.now() + (7 * DAY_IN_MILLIS))
  });

  await newSession.save()
  return newSession.token;
}

/********************************************************************/



module.exports = (data) => {
  console.log('requiring login routes...')

  const express = require('express')
  const app = express.Router()

  app.post('/login', async(req, res) => {
    console.log('api: LOGIN -> POST')

    const { handle, password } = req.body;

    let userQuery = await data.User
      .find({handle: {$regex: `^${handle}$`, $options: 'i'}})
      .select('+password')
      .exec();
    if(!userQuery.length) userQuery = await data.User
      .find({email: {$regex: `^${handle}$`, $options: 'i'}})
      .select('+password')
      .exec();

    if(userQuery.length) {
      const user = userQuery[0];
      const compared = await data.bcrypt.compare(password, user.password)
      if(compared) {
        const token = await createSession(data, user._id);
        const lists = await data.ItemList.find({userId: user._id}).exec();

        user.activity.lastSeen = new Date();
        user.markModified('activity.lastSeen')
        await user.save()
        res.status(200).send({
          message: `Succesfully signed in as ${user.handle}`,
          user: {...user._doc, lists: lists},
          token: token
        })
      }

      else res.status(200).send({
        message: `Incorrect username or password`
      })
    }
    else res.status(200).send({
      message: `Incorrect username or password`
    })
  })


  app.post('/login/withToken', async(req, res) => {
    console.log('api: LOGIN/WITHTOKEN -> POST')

    const { token } = req.body;
    try {
      const result = await data.Session.find({token: token}).exec();
      if(result.length) {
        const session = result[0]
        const expiration = new Date(Date.now() + (7 * DAY_IN_MILLIS))
        session.expiration = expiration
        session.markModified('expiration');
        await session.save()

        const user = await data.User.findById(result[0].userId.valueOf()).exec();
        const lists = await data.ItemList.find({userId: user._id}).exec();


        user.activity.lastSeen = new Date();
        user.markModified('activity.lastSeen')
        await user.save()
        res.status(200).send({
          message: `Succesfully signed in as ${user.handle}`,
          user: {...user._doc, lists: lists},
          token: token
        })
      }

      else res.status(400).send({
        message: `Could not find session ${token}`,
        error: {}
      })
    } catch (err) {
      res.status(400).send({
        message: 'There was an issue logging in. Try again',
        error: err
      })
    }

  })


  app.delete('/login', async(req, res) => {
    console.log('api: LOGIN -> DELETE')
    const { validation } = req.body;

    const validSession = await data.validateSession(validation)
    if(!validSession) res.status(400).send({
      message: `You must be signed in to perform this action`,
      error: {}
    })

    else {
      const result = await data.Session.deleteOne(validation, (deleteError) => {
        if(deleteError) res.status(400).send({
          message: `Could not delete session`,
          error: deleteError
        })

        else res.status(200).send({
          message: `Succesfully ended session`,
        })
      }).catch((err) => {
        return err;
      })
    }
  })

  return app;
}
