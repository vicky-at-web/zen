const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/zen26');
const Product = require('../models/product.js');
const { features, types } = require('./productNames.js');
const details = require('./details.js')
const categories = [
    "electronics",
    "fashion",
    "home_kitchen",
    "books",
    "beauty_personal_care",
    "health_wellness",
    "sports_outdoors",
    "toys_games",
    "automotive",
    "grocery_gourmet_food",
    "baby_products",
    "pet_supplies",
    "industrial_scientific",
    "office_products",
    "tools_home_improvement",
    "musical_instruments",
    "software",
    "arts_crafts_sewing",
    "movies_tv",
    "video_games"
];
const db = mongoose.connection;
const Seller = require('../models/seller.js')


db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
    console.log('DATABASE CONNECTED');
});

function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
}

// Example usage:
const startDate = '2018-01-01'; // Start date for the range
const endDate = '2024-03-17';   // End date for the range


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    const seller = await Seller.findById('66448f3704100ff5e7bae60b')
    await Product.deleteMany({});
    for (let i = 1; i <= 2000; i++) {
        const randomLaunchDate = getRandomDate(startDate, endDate);
        const productName = `${sample(features)} ${sample(types)}`;
        const sanitizedProductName = productName.replace(/[^\w\s]/g, '');
        const searchName1 = sanitizedProductName.toLowerCase().split(' ');
        const searchName2 = searchName1.join(''); // Join without any separator
        const price = Math.floor(Math.random() * 10000);
        const category = sample(categories).replace(/\\s+/g, '');
        const product = new Product({
            name: productName,
            searchTerm: searchName2,
            imageUrl: ['https://i.pinimg.com/736x/c5/7a/f7/c57af701db7abfb71c97ac12bc529b71.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTTwRtcKqcCHB7PU0hIwKhkj497sCJ_q2hg&s', 'https://w0.peakpx.com/wallpaper/909/368/HD-wallpaper-monkey-d-luffy-anime-white-hair-one-piece-sun-god-nika-gear-5th-resolution.jpg'],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            price: price,
            category: category,
            rating: 0,
            brand: 'Zen Recommends',
            headers: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            launchDate: randomLaunchDate,
            seller: '66448f3704100ff5e7bae60b'
        });
        product.details = {
            brand: "MegaCorp",
            model: "SuperNova X500",
            processor: "Novacore i9-12900K",  // Duplicate key (different value)
            memory: "32GB DDR5 RAM",
            storage: "1TB PCIe NVMe SSD",
            graphicsCard: "MegaCorp RTX 4080",
            processor: "Novacore i7-12700K",  // Duplicate key
            display: "1440p 240Hz IPS Panel",
            operatingSystem: "Windows 11 Pro",
            ports: ["USB-A 3.2 Gen 2", "USB-C Thunderbolt 4", "HDMI 2.1", "Ethernet"],
            warranty: "1 Year Standard"
          };
        product.additionalInfos = {
            weight: "3.5 kg",  // Approximate weight
            length: 38,         // Dimensions in centimeters
            width: 20,
            height: 15,
            cooling: "Liquid cooling",
            wirelessConnectivity: "Wi-Fi 6E, Bluetooth 5.2",  // Comma-separated string
            audio: "Integrated 7.1 channel sound card",
            includedSoftware: ["Windows 11 Pro", "MegaCorp Control Center"],
            warranty: "1 Year Standard (extendable to 3 years)",
            awards: [            // Array of strings
              "Best Gaming PC 2024 - TechCrunch",
              "Editor's Choice - PC Gamer Magazine"
            ]
          };
        await product.save();
        await seller.products.push(product)
        await seller.save();
        console.log(`${i} product is saved`)
    }
};


seedDb().then(() => {
    mongoose.connection.close();
});



