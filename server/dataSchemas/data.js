const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

exports.connect = () => {
  const uri = `mongodb+srv://${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}@gimmecluster.vo2kp.mongodb.net/gimmeDB?retryWrites=true&w=majority`
  // const uri = "mongodb://localhost:27017/gimmeDB"
  mongoose.connect(uri, { useNewUrlParser: true })
}

/*** Local Helper Functions ************************************/

const validateHandle = (handle) => {
  if(handle && handle.length){
    const reserved = new Set(['login', 'account', 'friends'])
    const lower = handle.toLowerCase()

    if(reserved.has(lower)) return false;

    const re = /^[A-Za-z0-9_]+$/
    if (!re.test(handle)) return false;

    return true;
  }

  else return false;
}


const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}

/*** Mongoose Schemas **************************************/

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  expiration: { type: Date, required: true, default: Date.now }
  // userId: { type: String, required: true }
})
exports.Session = mongoose.model('sessions', sessionSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true},
  handle: { type: String, required: true, unique: true, trim: true,
    validate: [validateHandle, 'Please enter a valid username'] },
  email: { type: String, required: true, unique: true, trim: true, select: false,
    validate: [validateEmail, 'Please enter a valid email'] },
  password: { type: String, required: true, select: false },
  activity: {
    type: {
      _id: false,
      dateCreated: { type: Date, required: true, default: Date.now },
      lastSeen: { type: Date, required: true, default: Date.now },
    },
    required: true,
  },
  statistics: {
    type: {
      _id: false,
      totalLists: { type: Number, required: true, default: 0},
      totalItems:  { type: Number, required: true, default: 0},
    },
    default: {
      totalLists: 0,
      totalItems: 0,
    },
    required: true,
  },
  following: { type: [String], required: true, default: [] },
  followers: { type: [String], required: true, default: [] },
})
exports.User = mongoose.model("users", userSchema)

const itemListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  // userId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  lastUpdate: { type: Date, required: true, default: Date.now },
  privacy: { type: String, enum: ['PRIVATE', 'PUBLIC', 'FRIENDS', 'CUSTOM'], required: true, default: 'PUBLIC'},
  listItems: { type: [String], required: true }
})
exports.ItemList = mongoose.model("itemlists", itemListSchema)

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemList', required: true },
  // userId: { type: String, required: true },
  // listId: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  lastUpdate: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true, trim: true },
  images: { type: [String], required: true, default: [] },
  links: { type: [String], required: true, default: [] },
  notes: { type: String, required: false, default: '' },
  tags: { type: [String], required: true, default: [] },
  likes: { type: Number, required: true, default: 0 },
  comments: { type: [String], required: true, default: [] }
})
exports.Item = mongoose.model("items", itemSchema)

const buyerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['interested', 'purchased'], required: true },
    lastUpdate: { type: Date, required: true, default: Date.now }
})

const buyerListSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    buyers: { type: [ buyerSchema ], required: true, default: [] }
})
exports.BuyerList = mongoose.model("buyerlists", buyerListSchema);

/*** Helper Functions ******************************************/

exports.validateSession = async (options) => {
  if(!options) return false

  const { token, userId } = options;
  if(!token || !userId) return false;

  const query = await exports.Session.find({token: token, userId: userId}).exec();
  return !!query.length;
}

exports.dropExpiredSessions = async () => {
  exports.Session.deleteMany({
    $or: [
      { expiration: { $lt: new Date() } },
      { expiration: { $exists: false } }
    ]
  }).exec()
}

exports.bcrypt = {
  ...bcrypt,
  hash: (plaintextPassword) => {
    return bcrypt.hash(plaintextPassword, saltRounds)
  },
  compare: (plaintextPassword, hash) => {
    return bcrypt.compare(plaintextPassword, hash)
  }
}

/*** Dummy Data ************************************************/

const { testusers } = require('./dummy.js');

exports.dropdata = async () => {
  await exports.Session.deleteMany()
  await exports.User.deleteMany()
  await exports.Item.deleteMany()
  await exports.ItemList.deleteMany()
}

exports.filldummydata = async () => {
  await Promise.all(
    testusers.map(async (user) => {
      let now = new Date();
      const hash = await exports.bcrypt.hash(user.password)
      const newUser = new exports.User({
        name: user.name,
        handle: user.handle,
        email: user.email,
        password: hash,
        activity: {
          dateCreated: now,
          lastSeen: now,
        }
      })
      await newUser.save()

      now = new Date();
      await Promise.all(
        user.lists.map(async (list) => {
          const newList = new exports.ItemList({
            userId: newUser._id,
            name: list.listName,
            dateCreated: now,
            lastUpdate: now,
            privacy: (list.privacy) ? list.privacy : 'PUBLIC',
            listItems: [],
          });

          await Promise.all(
            list.listItems.map(async (item) => {
              now = new Date();
              const newItem = new exports.Item({
                userId: newUser._id,
                listId: newList._id,
                dateCreated: now,
                lastUpdate: now,
                name: item.name,
                images: item.images,
                notes: item.notes,
                links: item.links,
                tags: item.tags,
              })

              newList.listItems.push(newItem._id);
              newList.lastUpdate = now;

              await newItem.save()
              newUser.statistics.totalItems++;
            })
          )
          await newList.save()
          newUser.statistics.totalLists++;
        })
      )
      await newUser.save()
    })
  );


  // now make friends
  testusers.map(async (user) => {
    const userDoc = (await exports.User.find({handle: user.handle}).exec())[0];

    await Promise.all(
      user.following.map(async (handle) => {
        const userQuery = await exports.User
        .find({handle: handle})
        .exec()
        .catch((err) => { return error; });

        if(userQuery.length) {
          userDoc.following.push(userQuery[0]._id)
          userQuery[0].followers.push(userDoc._id)
          userQuery[0].markModified('followers')
          await userQuery[0].save()
        }
      })
    )

    userDoc.markModified('following');
    await userDoc.save()
  })
}
