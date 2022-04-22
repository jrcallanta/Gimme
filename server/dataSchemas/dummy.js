/*******************************************
*  DummyData Test Lists
*
*/

const anotherList = {
  listName: 'Another List',
  listItems: [
    {
      name: 'Oversized Cardigan',
      images: ['/img/blue-cardigan.png'],
      links: ['https://www.yesstyle.com/en/foev-v-neck-cardigan/info.html/pid.1108137281'],
      notes: 'size small in light blue pls',
      tags: ['clothing'],
    },
    {
      name: 'Oversized Cardigan',
      images: ['https://d1flfk77wl2xk4.cloudfront.net/Assets/88/462/XXL_p0163646288.jpg'],
      links: ['https://www.yesstyle.com/en/foev-v-neck-cardigan/info.html/pid.1108137281'],
      notes: '',
      tags: ['clothing', 'korean brands'],
    },
    {
      name: 'iPhone Stand',
      images: ['https://m.media-amazon.com/images/I/61vcpyB7UEL._AC_SL1500_.jpg'],
      links: [],
      notes: 'I already have one but I want two.',
      tags: ['electronics', 'iphone'],
    },
    {
      name: 'Jersey Cotton Bed Sheets',
      images: [
        'https://m.media-amazon.com/images/I/81gPqt+1QxL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/91-YIPFIYkL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/61vcpyB7UEL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/81bghB0l+GL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/61vcpyB7UEL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/81gPqt+1QxL._AC_SL1500_.jpg',
      ],
      links: [
        'https://www.amazon.com/PURE-ERA-T-Shirt-Heathered-Pillowcases/dp/B097Y5WYLQ/ref=cs_sr_dp_3?keywords=jersey%2Bcotton%2Bsheets&qid=1643694226&s=home-garden&sprefix=jersey%2Bco%2Cgarden%2C137&sr=1-11&th=1',
      ],
      notes: "I really like the burnt orange color, but I'm also looking for a brownish color.",
      tags: ['home', 'pricey', 'on amazon', 'bedding'],
    }
  ]
};

const privateList = {
  listName: 'Privte List',
  privacy: 'PRIVATE',
  listItems: [
    {
      name: 'Oversized Cardigan',
      images: ['/img/blue-cardigan.png'],
      links: ['https://www.yesstyle.com/en/foev-v-neck-cardigan/info.html/pid.1108137281'],
      notes: 'size small in light blue pls',
      tags: ['clothing'],
    },
    {
      name: 'Cropped Straight Fit Pants',
      images: ['/img/cropped-straight-fit-jeans.png'],
      links: [
        'https://www.yesstyle.com/en/jaywoon-cropped-straight-leg-jeans/info.html/pid.1096860285',
        'https://www.yesstyle.com/en/jaywoon-cropped-straight-leg-jeans/info.html/pid.1096858175',
        'https://www.yesstyle.com/en/jaywoon-cropped-straight-leg-jeans/info.html/pid.1096858175',
        'https://www.yesstyle.com/en/jaywoon-cropped-straight-leg-jeans/info.html/pid.1096858175',
        'https://www.yesstyle.com/en/jaywoon-cropped-straight-leg-jeans/info.html/pid.1096858175',
      ],
      notes: 'either shade is fine. size 28waist or size small? i guess??',
      tags: ['clothing', 'pricey', 'long awaited', 'korean brands', 'pants'],
    },
    {
      name: 'Perfect Pushup',
      images: ['/img/perfect-pushup.png'],
      links: ['https://www.amazon.com/Perfect-Fitness-Pushup-Elite/dp/B008DNAJ5M/ref=sr_1_1_sspa?crid=AB9M9FIJHQA0&keywords=perfect+pushup&qid=1642245815&sprefix=perfect+pushup%2Caps%2C125&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyWkFCNE9WSlpQVU9BJmVuY3J5cHRlZElkPUEwMTk3MjIxM0UxWExURloyV1U5VSZlbmNyeXB0ZWRBZElkPUEwOTY1MTU1MVcwMURJMVJZRDFUWiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU='],
      notes: 'cuz ya boi needs to stay in shape lol',
      tags: ['on amazon', 'fitness', 'equipment'],
    },
  ]
};

const breaker = {
  listName: 'Some%20List',
  listItems: [
    {
      name: 'Some Item',
      images: [],
      links: [],
      notes: 'tryna break it',
      tags: ['error'],
    },
  ]
}

const problem = {
  listName: 'Some List',
  listItems: [
    {
      name: 'Some Other Item',
      images: [],
      links: [],
      notes: 'might not show up',
      tags: ['error', 'problem'],
    },
  ]
}



/*******************************************
*  DummyData Test Users
*
*/

const testUser1 = {
  name: 'Test User',
  handle: 'tesuser',
  email: 'tesuser@test.com',
  password: 'password1',
  statistics: {
    totalLists: 0,
    totalItems:  0,
  },
  following: ['michimi', 'userwithareallyreallylongname'],
  followers: [],
  lists: [anotherList]
}

const testUser2 = {
  name: 'Michigo',
  handle: 'michimi',
  email: 'michigogo@test.com',
  password: 'password',
  statistics: {
    totalLists: 0,
    totalItems:  0,
  },
  following: [],
  followers: [
    'tesuser'
  ],
  lists: [privateList]
}

const testUser3 = {
  name: 'Poe',
  handle: 'edgar_allen',
  email: 'theraven@poets.society.com',
  password: 'pass',
  following: ['userwithareallyreallylongname'],
  followers: [],
  lists: [breaker, problem]
}

const testUser4 = {
  name: 'UserWithAReallyReallyLongName',
  handle: 'userwithareallyreallylongname',
  email: 'longuser@email.com',
  password: 'longpassword',
  following: ['michimi', 'tesuser', 'edgar_allen'],
  followers: ['tesuser', 'edgar_allen'],
  lists: []
}

// const loopers = []
// const loopers__size = 10
// for(let i = 0; i < loopers__size; i++){
//   const user = {
//     name: `usernum${i}`,
//     handle: `number${i}`,
//     email: `email${i}@test.com`,
//     password: 'password',
//     following: [],
//     followers: [],
//     lists: [],
//   }
//   loopers.push(user)
// }
// for(let i = 0; i < loopers.length; i++){
//   for(let j = i + 1; j < loopers.length; j++){
//     loopers[i].followers.push(`number${j}`)
//     loopers[j].following.push(`number${i}`)
//   }
// }
// loopers[2].following.push(`number8`)
// loopers[8].followers.push(`number2`)
//
// loopers[2].following.push(`number4`)
// loopers[4].followers.push(`number2`)
//
// loopers[4].following.push(`number7`)
// loopers[7].followers.push(`number4`)

exports.testusers = [testUser1, testUser2, testUser3, testUser4];
