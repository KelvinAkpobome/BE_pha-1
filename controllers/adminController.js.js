/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const faker = require('faker');
const { db } = require('../config/db');
const { successResMsg, errorResMsg } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

exports.indexDB = catchAsync(async (req, res, next) => {
  try {
    logger.info('Started indexing, may take awhile');
    await db.collection('listings').createIndex({ price: 1 });
    await db.collection('listings').createIndex({ category: 1, typeOfProperty: 'text' });
    await db.collection('listings').createIndex({ createdAt: 1 });
    await db.collection('scheduledInspections').createIndex({ bookingId: 1 });
    logger.info('Indexing completed');
    return successResMsg(res, 201, 'Indexing completed');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.seedDB = catchAsync(async (req, res, next) => {
  try {
    logger.info('Started seeding Db with 200 listings, may take awhile. Sit tight');
    const listings = [];

    for (let i = 0; i < 2000; i++) {
      const fakeListingData = {
        location: faker.address.streetAddress(),
        area: faker.address.streetSuffix(),
        price: faker.datatype.number(),
        category: faker.random.arrayElement(['buy', 'rent']),
        createdAt: new Date(),
        features: [
          faker.random.arrayElement(['2 toilets', 'No car park']),
          faker.random.arrayElement(['Landlord leave within', 'very first floor from top']),
          faker.random.arrayElement(['No POP', 'Linking Street not tarred']),
        ],
        typeOfProperty: faker.random.arrayElement(['1 bedroom flat', 'Self contain', '2 bedroom flat', '3 bedroom flat', '2 bedroom duplex', '3 bedroom duplex', '4 bedroom duplex']),
        charges: [{ 'legal fee': faker.datatype.number() }, { 'Agent fee': faker.datatype.number() }, { 'Caution fee': faker.datatype.number() }],
        images: [
          faker.random.arrayElement([
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825534/Agents/IMG_20210827_080017_824_votqlj.jpg',
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825470/Agents/IMG_20210814_115656_244_xabvnl.jpg'
          ]),
          faker.random.arrayElement([
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_270_ztnpkl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_279_usna06.jpg',
          ]),
          faker.random.arrayElement([ 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825476/Agents/IMG_20210814_115656_527_what5q.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825481/Agents/IMG_20210816_160815_310_hdf3cl.jpg'
          ]),
          faker.random.arrayElement([ 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825487/Agents/IMG_20210816_160815_412_vzdudc.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825494/Agents/IMG_20210818_212638_037_idye65.jpg'
          ]),
          faker.random.arrayElement([
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825502/Agents/IMG_20210818_212638_066_uhbu0l.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825521/Agents/IMG_20210827_080017_757_llk27f.jpg' 
          ]),
          faker.random.arrayElement([
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825534/Agents/IMG_20210827_080017_824_votqlj.jpg',
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825470/Agents/IMG_20210814_115656_244_xabvnl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_270_ztnpkl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_270_ztnpkl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_279_usna06.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825476/Agents/IMG_20210814_115656_527_what5q.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825481/Agents/IMG_20210816_160815_310_hdf3cl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825487/Agents/IMG_20210816_160815_412_vzdudc.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825494/Agents/IMG_20210818_212638_037_idye65.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825502/Agents/IMG_20210818_212638_066_uhbu0l.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825521/Agents/IMG_20210827_080017_757_llk27f.jpg' 
          ]),
          faker.random.arrayElement([
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825534/Agents/IMG_20210827_080017_824_votqlj.jpg',
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825470/Agents/IMG_20210814_115656_244_xabvnl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_270_ztnpkl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_270_ztnpkl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825471/Agents/IMG_20210814_115656_279_usna06.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825476/Agents/IMG_20210814_115656_527_what5q.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825481/Agents/IMG_20210816_160815_310_hdf3cl.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825487/Agents/IMG_20210816_160815_412_vzdudc.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825494/Agents/IMG_20210818_212638_037_idye65.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825502/Agents/IMG_20210818_212638_066_uhbu0l.jpg', 
            'https://res.cloudinary.com/drlbf59zf/image/upload/v1637825521/Agents/IMG_20210827_080017_757_llk27f.jpg' 
          ])

        ]};
      listings.push(fakeListingData);
    }
    await db.collection('listings').insertMany(listings);
    return successResMsg(res, 201, 'seeding of listings collection completed');
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});
