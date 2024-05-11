
module.exports.computerDetailsSchema = {
    brand: String,
    model: String,
    processor: {
        brand: String,
        model: String
    },
    ram: String,
    storage: {
        ssd: String,
        hdd: String,
    },
    graphics: {
        brand: String,
        model: String,
        vram: Number
    },
    operatingSystem: String,
    display: {
        resolution: {
            height: Number,
            width: Number,
        },
        panelType: String
    },
    connectivities: {
        wifi: String,
        bluetooth: String,
        usb: String,
        ethernet: String
    },
    battery: String,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        weight: Number
    },
    warranty: String,
    specialFeatures: String

}
module.exports.mobileDetailsSchema = {

    brand: String,
    model: String,
    operatingSystem: String,
    storage: {
        ram: String,
        storage: String,
    }, processor: {
        brand: String,
        model: String
    },
    camera: {
        rear: String,
        front: String,
    },
    battery: String,
    display: {
        resolution: {
            height: Number,
            weight: Number,
        },
        panelType: String
    },
    connectivity: {
        cellular: String,
        wifi: String,
        bluetooth: String
    },
    specialFeatures: String

}

module.exports.cameraDetailsSchema = {

    brand: String,
    model: String,
    sensor: {
        type: String,
        megapixels: Number
    },
    lens: {
        mount: String,
        focalLength: String,
        aperture: String
    },
    shootingModes: [String],
    video: {
        resolution: String,
        fps: String
    },
    display: {
        type: String,
        size: Number
    },
    connectivity: {
        wifi: String,
        bluetooth: String
    },
    specialFeatures: String

}

module.exports.menDetailsSchema = {
    fit: String,
    size: {
        type: {
            string: String,
            numerical: Number
        },
        chest: Number,
        waist: Number,
        length: Number
    },
    material: String,
    color: String,
    sleeveLength: String,
    occasion: String,
    closure: String,
    washCare: String,
    style: String,
    brand: String
}

module.exports.womensDetailsSchema = {
    fit: String,
    size: {
        type: {
            string: String,
            numerical: Number
        },
        bust: Number,
        waist: Number,
        hips: Number,
        length: Number
    },
    material: String,
    color: String,
    sleeveLength: String,
    occasion: String,
    closure: String,
    washCare: String,
    style: String,
    brand: String
}

module.exports.kidsDetailsSchema = {
    ageGroup: String,
    size: {
        type: {
            string: String,
            numerical: Number
        },
        chest: Number,
        waist: Number,
        length: Number
    },
    material: String,
    color: String,
    occasion: String,
    closure: String,
    washCare: String,
    character: String,
    style: String,
    brand: String
}

module.exports.accessoriesDetailsSchema = {
    material: String,
    color: String,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    style: String,
    brand: String
}
module.exports.decorDetailsSchema = {
    material: String,
    color: String,
    style: String,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    placement: String,
    brand: String
}
module.exports.kitchenDetailsSchema = {
    material: String,
    color: String,
    capacity: String,
    wattage: Number,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    brand: String
}
module.exports.beddingDetailsSchema = {
    material: String,
    color: String,
    size: String,
    threadCount: Number,
    brand: String
}
module.exports.skincareDetailsSchema = {
    type: String,
    or: [{ skinType: String }],
    brand: String
}
module.exports.haircareDetailsSchema = {
    hairType: String,
    or: [{ type: String }],
    brand: String
}
module.exports.perfumesDetailsSchema = {
    perfumeType: String,
    size: String,
    brand: String
}
module.exports.booksDetailsSchema = {
    author: String,
    genre: String,
    format: String,
    publicationDate: Date,
    ISBN: String,
    pageCount: Number,
    language: String
}
module.exports.moviesDetailsSchema = {
    title: String,
    director: String,
    releaseDate: Date,
    runtime: Number,
    genre: [String],
    cast: [String],
    format: String,
    mpaaRating: String,
    plotSummary: String
}
module.exports.musicDetailsSchema = {
    artist: String,
    album: String,
    genre: [String],
    releaseDate: Date,
    format: String,
    songTitles: [String],
    explicitLyrics: Boolean,
    recordLabel: String
}
module.exports.equipmentDetailsSchema = {
    type: String,
    or: [{ subcategory: String }],
    brand: String,
    model: String,
    material: String,
    color: String,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    wattage: Number,
    capacity: String,
    features: [String],
    usage: String
}
module.exports.activewearDetailsSchema = {
    type: String,
    gender: String,
    material: String,
    color: String,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    supportLevel: String,
    features: [String],
    closure: String,
    pockets: Boolean
}
module.exports.campingDetailsSchema = {
    capacity: Number,
    type: String,
    material: String,
    color: String,
    weight: Number,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    features: [String],
    packedSize: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    seasons: String,
    brand: String
}
module.exports.kidstoysDetailsSchema = {
    ageGroup: String,
    category: String,
    material: String,
    educationalValue: String,
    interactiveFeatures: String,
    batteryPowered: Boolean,
    characters: [String],
    brand: String
}
module.exports.boardgamesDetailsSchema = {
    minPlayers: Number,
    maxPlayers: Number,
    ageGroup: String,
    playingTime: String,
    theme: String,
    skills: [String],
    brand: String
}
module.exports.videogamesDetailsSchema = {
    platform: String,
    genre: [String],
    releaseDate: Date,
    multiplayer: Boolean,
    ESRBrating: String, // Combined ESRB rating property without spaces
    developer: String,
    publisher: String
}
module.exports.medicinesDetailsSchema = {
    name: String,
    type: String,
    intendedUse: String,
    dosage: String,
    sideEffects: [String],
    warnings: [String],
    brand: String
}
module.exports.fitnessequipmentDetailsSchema = {
    type: String,
    muscleGroupTargeted: [String],
    weightLimit: Number,
    resistanceLevels: Number,
    dimensions: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    foldable: Boolean,
    features: [String],
    brand: String
}
module.exports.monitoringdevicesDetailsSchema = {
    type: String,
    metricsTracked: [String],
    connectivity: String,
    batteryLife: String,
    waterResistance: String,
    compatibleDevices: [String],
    brand: String
}
module.exports.caraccessoriesDetailsSchema = {
    type: String,
    compatibility: [String],
    material: String,
    color: String,
    features: [String],
    brand: String
}
module.exports.maintenanceDetailsSchema = {
    type: String,
    application: String,
    capacity: Number,
    compatibility: [String],
    brand: String
}
module.exports.motorcyclegearDetailsSchema = {
    type: String,
    size: String,
    material: String,
    color: String,
    features: [String],
    brand: String
}
module.exports.ornamentsDetailsSchema = {
    type: String,
    material: String,
    color: String,
    size: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    theme: String,
    brand: String
}
module.exports.stationaryDetailsSchema = {
    type: String,
    material: String,
    color: String,
    count: Number,
    size: String,
    features: [String],
    brand: String
}
module.exports.furnitureDetailsSchema = {
    type: String,
    material: String,
    color: String,
    dimensions: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    style: String,
    features: [String],
    brand: String
}
module.exports.electronicsDetailsSchema = {
    type: String,
    brand: String,
    model: String,
    color: String,
    screenSize: String,
    storageCapacity: String,
    connectivity: [String],
    features: [String]
}
module.exports.snacksDetailsSchema = {
    type: String,
    weight: Number,
    quantity: Number,
    organic: Boolean,
    dietaryRestrictions: [String],
    brand: String
}
module.exports.groceriesDetailsSchema = {
    type: String,
    weight: Number,
    servingSize: String,
    sweetOrSavory: String,
    dietaryRestrictions: [String],
    brand: String
}
module.exports.beveragesDetailsSchema = {
    type: String,
    volume: Number,
    flavor: String,
    carbonated: Boolean,
    caffeinated: Boolean,
    dietaryRestrictions: [String],
    brand: String
}
module.exports.petfoodDetailsSchema = {
    type: String,
    petAge: String,
    petBreedSize: String,
    dietaryNeeds: String,
    weight: Number,
    brand: String
}
module.exports.careproductsDetailsSchema = {
    type: String,
    targetAudience: String,
    skinType: [String],
    ingredients: [String],
    organic: Boolean,
    crueltyFree: Boolean,
    brand: String
}
module.exports.handmadeDetailsSchema = {
    type: String,
    material: String,
    madeToOrder: Boolean,
    processingTime: String,
    customizable: Boolean,
    dimensions: {
        type: String,
        or: [
            { width: Number },
            { height: Number },
            { length: Number }
        ]
    },
    careInstructions: String
}

