module.exports.computerDetails = {
    brand: "TechBrand",
    model: "TB-X9000",
    processor: {
        brand: "Intel",
        model: "i7-11700K"
    },
    ram: "16GB DDR4",
    storage: {
        ssd: "512GB",
        hdd: "1TB"
    },
    graphics: {
        brand: "NVIDIA",
        model: "RTX 3070",
        vram: 8
    },
    operatingSystem: "Windows 10 Pro",
    display: {
        resolution: {
            height: 1440,
            width: 2560
        },
        panelType: "IPS"
    },
    connectivities: {
        wifi: "802.11ax",
        bluetooth: "5.0",
        usb: "4 x USB 3.0",
        ethernet: "1Gbps"
    },
    battery: "90Wh",
    dimensions: {
        length: 350,
        width: 250,
        height: 20,
        weight: 2.5
    },
    warranty: "2 years",
    specialFeatures: "RGB Keyboard, Thunderbolt 4"
};

module.exports.mobileDetails = {
    brand: "SmartTech",
    model: "ST-ProMax",
    operatingSystem: "Android 12",
    storage: {
        ram: "8GB",
        internal: "128GB"
    },
    processor: {
        brand: "Qualcomm",
        model: "Snapdragon 888"
    },
    camera: {
        rear: "108MP + 12MP + 5MP",
        front: "32MP"
    },
    battery: "4500mAh",
    display: {
        resolution: {
            height: 2400,
            width: 1080
        },
        panelType: "AMOLED"
    },
    connectivity: {
        cellular: "5G",
        wifi: "802.11ax",
        bluetooth: "5.1"
    },
    specialFeatures: "In-display Fingerprint Sensor, Face Recognition"
};

module.exports.cameraDetails = {
    brand: "PhotoSnap",
    model: "PS-500D",
    sensor: {
        type: "Full-Frame",
        megapixels: 24
    },
    lens: {
        mount: "EF",
        focalLength: "24-70mm",
        aperture: "f/2.8"
    },
    shootingModes: ["Auto", "Manual", "Portrait", "Landscape"],
    video: {
        resolution: "4K",
        fps: "60"
    },
    display: {
        type: "LCD",
        size: 3
    },
    connectivity: {
        wifi: "Yes",
        bluetooth: "Yes"
    },
    specialFeatures: "Touch Screen, Weather-Sealed Body"
};

module.exports.menDetails = {
    fit: "Regular",
    size: {
        type: {
            string: "M",
            numerical: 40
        },
        chest: 102,
        waist: 86,
        length: 74
    },
    material: "Cotton",
    color: "Blue",
    sleeveLength: "Long",
    occasion: "Casual",
    closure: "Buttons",
    washCare: "Machine Wash",
    style: "Solid",
    brand: "FashionHub"
};

module.exports.womensDetails = {
    fit: "Slim",
    size: {
        type: {
            string: "S",
            numerical: 36
        },
        bust: 90,
        waist: 70,
        hips: 94,
        length: 95
    },
    material: "Polyester",
    color: "Red",
    sleeveLength: "Short",
    occasion: "Party",
    closure: "Zipper",
    washCare: "Hand Wash",
    style: "Floral",
    brand: "StyleQueen"
};

module.exports.kidsDetails = {
    ageGroup: "4-5 Years",
    size: {
        type: {
            string: "XS",
            numerical: 28
        },
        chest: 58,
        waist: 52,
        length: 60
    },
    material: "Cotton",
    color: "Green",
    occasion: "Everyday",
    closure: "Velcro",
    washCare: "Machine Wash",
    character: "Superhero",
    style: "Printed",
    brand: "KidsWear"
};

module.exports.accessoriesDetails = {
    material: "Leather",
    color: "Black",
    size: {
        type: "One Size",
        dimensions: {
            width: 10,
            height: 15,
            length: 1
        }
    },
    style: "Classic",
    brand: "AccessoryPro"
};

module.exports.decorDetails = {
    material: "Ceramic",
    color: "White",
    style: "Modern",
    size: {
        type: "Medium",
        dimensions: {
            width: 20,
            height: 25,
            length: 20
        }
    },
    placement: "Indoor",
    brand: "HomeDeco"
};

module.exports.kitchenDetails = {
    material: "Stainless Steel",
    color: "Silver",
    capacity: "2 Liters",
    wattage: 1500,
    size: {
        type: "Compact",
        dimensions: {
            width: 15,
            height: 25,
            length: 15
        }
    },
    brand: "KitchenMaster"
};

module.exports.beddingDetails = {
    material: "Cotton",
    color: "White",
    size: "Queen",
    threadCount: 300,
    brand: "SleepWell"
};

module.exports.skincareDetails = {
    type: "Moisturizer",
    skinType: "Dry",
    brand: "SkinGlow"
};

module.exports.haircareDetails = {
    hairType: "Curly",
    type: "Shampoo",
    brand: "HairCarePlus"
};

module.exports.perfumesDetails = {
    perfumeType: "Eau de Parfum",
    size: "100ml",
    brand: "FragranceWorld"
};

module.exports.booksDetails = {
    author: "Jane Doe",
    genre: "Fiction",
    format: "Paperback",
    publicationDate: new Date('2021-06-01'),
    ISBN: "978-3-16-148410-0",
    pageCount: 320,
    language: "English"
};

module.exports.moviesDetails = {
    title: "The Great Adventure",
    director: "John Smith",
    releaseDate: new Date('2022-11-11'),
    runtime: 120,
    genre: ["Action", "Adventure"],
    cast: ["Actor A", "Actor B"],
    format: "Blu-ray",
    mpaaRating: "PG-13",
    plotSummary: "A thrilling adventure of a lifetime."
};

module.exports.musicDetails = {
    artist: "The Rock Band",
    album: "Greatest Hits",
    genre: ["Rock", "Pop"],
    releaseDate: new Date('2020-09-15'),
    format: "CD",
    songTitles: ["Hit Song 1", "Hit Song 2"],
    explicitLyrics: false,
    recordLabel: "MusicWorld"
};

module.exports.equipmentDetails = {
    type: "Power Drill",
    subcategory: "Cordless",
    brand: "ToolTech",
    model: "X500",
    material: "Metal",
    color: "Red",
    size: {
        type: "Standard",
        dimensions: {
            width: 8,
            height: 25,
            length: 30
        }
    },
    wattage: 500,
    capacity: "20V",
    features: ["LED Light", "Variable Speed"],
    usage: "Construction"
};

module.exports.activewearDetails = {
    type: "Sports Bra",
    gender: "Female",
    material: "Nylon",
    color: "Black",
    size: {
        type: "M",
        dimensions: {
            width: 30,
            height: 25,
            length: 2
        }
    },
    supportLevel: "High",
    features: ["Breathable", "Quick Dry"],
    closure: "Hook",
    pockets: false
};

module.exports.campingDetails = {
    capacity: 4,
    type: "Tent",
    material: "Polyester",
    color: "Blue",
    weight: 5,
    size: {
        type: "Large",
        dimensions: {
            width: 200,
            height: 150,
            length: 250
        }
    },
    features: ["Waterproof", "UV Protection"],
    packedSize: {
        dimensions: {
            width: 50,
            height: 30,
            length: 30
        }
    },
    seasons: "3-Season",
    brand: "CampGear"
};

module.exports.kidstoysDetails = {
    ageGroup: "3-5 Years",
    category: "Educational",
    material: "Plastic",
    educationalValue: "STEM Learning",
    interactiveFeatures: "Sound Effects",
    batteryPowered: true,
    characters: ["Character A", "Character B"],
    brand: "ToyMaster"
};

module.exports.boardgamesDetails = {
    minPlayers: 2,
    maxPlayers: 4,
    ageGroup: "8+ Years",
    playingTime: "60 minutes",
    theme: "Strategy",
    skills: ["Problem Solving", "Critical Thinking"],
    brand: "GameZone"
};

module.exports.videogamesDetails = {
    platform: "PlayStation 5",
    genre: ["Action", "Adventure"],
    releaseDate: new Date('2023-02-20'),
    multiplayer: true,
    ESRBrating: "M",
    developer: "GameStudio",
    publisher: "GamePublishers"
};

module.exports.medicinesDetails = {
    name: "PainRelief",
    type: "Tablet",
    intendedUse: "Pain Management",
    dosage: "500mg",
    sideEffects: ["Nausea", "Drowsiness"],
    warnings: ["Not for use during pregnancy"],
    brand: "MediHealth"
};

module.exports.fitnessequipmentDetails = {
    type: "Treadmill",
    muscleGroupTargeted: ["Legs", "Cardio"],
    weightLimit: 150,
    resistanceLevels: 12,
    dimensions: {
        type: "Foldable",
        dimensions: {
            width: 75,
            height: 140,
            length: 190
        }
    },
    foldable: true,
    features: ["Heart Rate Monitor", "LCD Display"],
    brand: "FitnessPro"
};

module.exports.monitoringdevicesDetails = {
    type: "Fitness Tracker",
    metricsTracked: ["Heart Rate", "Steps", "Calories Burned"],
    connectivity: "Bluetooth",
    batteryLife: "7 days",
    waterResistance: "50 meters",
    compatibleDevices: ["iOS", "Android"],
    brand: "TrackFit"
};

module.exports.caraccessoriesDetails = {
    type: "Car Charger",
    compatibility: ["Universal"],
    material: "Plastic",
    color: "Black",
    features: ["Fast Charging", "Dual USB Ports"],
    brand: "AutoGear"
};

module.exports.maintenanceDetails = {
    type: "Engine Oil",
    application: "Lubrication",
    capacity: 5,
    compatibility: ["Petrol Engines"],
    brand: "CarCare"
};

module.exports.motorcyclegearDetails = {
    type: "Helmet",
    size: "L",
    material: "Fiberglass",
    color: "Matte Black",
    features: ["Visor", "Ventilation"],
    brand: "MotoSafe"
};

module.exports.ornamentsDetails = {
    type: "Christmas Ornament",
    material: "Glass",
    color: "Gold",
    size: {
        type: "Medium",
        dimensions: {
            width: 10,
            height: 15,
            length: 10
        }
    },
    brand: "FestiveDecor"
};

module.exports.stationaryDetails = {
    type: "Notebook",
    material: "Paper",
    color: "Blue",
    count: 100,
    size: "A4",
    features: ["Spiral Binding", "Perforated Pages"],
    brand: "WriteRight"
};

module.exports.furnitureDetails = {
    type: "Sofa",
    material: "Leather",
    color: "Brown",
    dimensions: {
        type: "Large",
        width: 200,
        height: 90,
        length: 100
    },
    style: "Modern",
    features: ["Recliner", "Cup Holders"],
    brand: "HomeComfort"
};

module.exports.electronicsDetails = {
    type: "Smart TV",
    brand: "ElectroMax",
    model: "EM-55UHD",
    color: "Black",
    screenSize: "55 inches",
    storageCapacity: "16GB",
    connectivity: ["WiFi", "Bluetooth", "HDMI", "USB"],
    features: ["4K UHD", "Voice Control", "HDR"]
};

module.exports.snacksDetails = {
    type: "Chips",
    weight: 200,
    quantity: 5,
    organic: true,
    dietaryRestrictions: ["Gluten-Free", "Vegan"],
    brand: "SnackHealthy"
};

module.exports.groceriesDetails = {
    type: "Pasta",
    weight: 500,
    servingSize: "100g",
    sweetOrSavory: "Savory",
    dietaryRestrictions: ["Non-GMO", "Vegan"],
    brand: "GroceryGoods"
};

module.exports.beveragesDetails = {
    type: "Soda",
    volume: 330,
    flavor: "Cola",
    carbonated: true,
    caffeinated: true,
    dietaryRestrictions: ["Sugar-Free"],
    brand: "DrinkFresh"
};

module.exports.petfoodDetails = {
    type: "Dry Food",
    petAge: "Adult",
    petBreedSize: "Medium",
    dietaryNeeds: "Grain-Free",
    weight: 10,
    brand: "PetNutri"
};

module.exports.careproductsDetails = {
    type: "Sunscreen",
    targetAudience: "Adults",
    skinType: ["Oily", "Sensitive"],
    ingredients: ["Zinc Oxide", "Aloe Vera"],
    organic: true,
    crueltyFree: true,
    brand: "SkinShield"
};

module.exports.handmadeDetails = {
    type: "Handmade Soap",
    material: "Organic Ingredients",
    madeToOrder: true,
    processingTime: "3 days",
    customizable: true,
    dimensions: {
        type: "Small",
        width: 5,
        height: 2,
        length: 7
    },
    careInstructions: "Keep Dry Between Uses"
};
