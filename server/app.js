require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();


app.use(express.static(path.resolve(__dirname, '../gimme-react-app/build/')));
app.use(bodyParser.urlencoded({extended: true}))

const router = require('./router/router');
app.use('/api/route', router)


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../gimme-react-app/build/', 'index.html'));

  // let indexPath = path.resolve(__dirname, '../gimme-react-app/public', 'index.html')
  // try {
  //   if(fs.existsSync(indexPath)){
  //     res.sendFile(indexPath);
  //   }
  // } catch (err) {
  //
  // }

})

app.listen(process.env.PORT || port, ()=>{
  console.log("Server has started succesfully! Listening on " + port);
})
