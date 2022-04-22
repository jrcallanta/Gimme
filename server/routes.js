const express = require('express')
const bodyParser = require('body-parser')

module.exports = async (app) => {
  app.use(bodyParser.json())

  const data = require('./dataSchemas/data.js');
  await data.connect();

  /***  for testing purposes  ***/
  await data.dropdata();
  await data.filldummydata();

  console.log('requiring routes...')
  require('./routes/loginRoutes')(app, data);
  require('./routes/userRoutes')(app, data);
  require('./routes/listroutes')(app, data);
  require('./routes/itemRoutes')(app, data);
  require('./routes/filteredItemRoutes')(app, data);
  require('./routes/toolRoutes')(app, data);
}
