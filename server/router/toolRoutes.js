module.exports = (data) => {
  console.log('requiring tool routes...')

  const express = require('express')
  const app = express.Router()

  app.get('/userHandleFromItemId/:itemId', async(req, res) => {
    console.log('api: USERHANDLEFROMITEMID/ITEM.ID -> GET')
    const { itemId } = req.params;

    const item = await data.Item.findById(itemId);
    if(item) {
      const user = await data.User.findById(item.userId)
      if(user) res.status(200).send({
        message: `Succesfully retrieved user handle from itemId ${itemId}`,
        handle: user.handle
      })
    }

    else res.status(400).send({
      message: `Could not find item ${itemId}`,
      error: {}
    })

  })

  return app;
}
