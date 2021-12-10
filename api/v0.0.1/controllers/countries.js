const Country = require('../models/countries')
const { nameFile, deleteFile } = require('../services/fileNameHandler')
const path = require('path')
const { countryImagesPath } = require('../../../config')

const capitalize = name => {
    const lower = name.toLowerCase()
    return name.charAt(0).toUpperCase() + lower.slice(1)
}

module.exports = {

    addCountry: async (name, code, imageFilename) => {
        try {
            if (await Country.findOne({ name: capitalize(name) })) return 0
            if (await Country.findOne({ code: code.toUpperCase() })) return 1
            let country = await Country.create({ name, code })
            nameFile(countryImagesPath, imageFilename, 'image', country, 'name')
            country.image = '/api/v0.0.1/countries/images/' + country.name.toLowerCase() + '_image' + path.extname(imageFilename)
            await country.save()
            return { id: country._id }
        } 
        catch (error) {
            console.log(error)    
        }
    },

    getCountryById: async (id) => {
        try {
            const country = await Country.findById(id)
            if (!country) return null
            return { id: country._id, name: country.name, code: country.code, image: country.image }
        } 
        catch (error) {
            console.log(error) 
        }
    },

    getCountryByCode: async (code) => {
        try {
            const country = await Country.findOne({ code: code.toUpperCase() })
            if (!country) return null
            return { id: country._id, name: country.name, code: country.code, image: country.image }
        } 
        catch (error) {
            console.log(error) 
        }
    },

    getAllCountries: async () => {
        try {
            const countries = await Country.find().select('-__v')
            if (countries.length == 0) return null
            let newCountries = []
            for (let i = 0; i < countries.length; i++) {
                const country = countries[i]
                const newCountry = { id: country._id, name: country.name, code: country.code, image: country.image }
                newCountries.push(newCountry)
            }
            return newCountries
        } 
        catch (error) {
            console.log(error) 
        }
    },

    updateCountryInfos: async (id, name, code) => {
        try {
            let country = await Country.findById(id)
            if (!country) return 0
            if ((await Country.findOne({ name: capitalize(name) })) && (await Country.findOne({ name: capitalize(name) })).id !== id) return 1
            if ((await Country.findOne({ code: code.toUpperCase() })) && (await Country.findOne({ code: code.toUpperCase() })).id !== id) return 2
            if (country.name != name) country.name = name
            if (country.code != code) country.code = code
            const imageFileName = country.image.replace('/api/v0.0.1/countries/images/', '')
            nameFile(countryImagesPath, imageFileName, 'image', country, 'name')
            country.image = '/api/v0.0.1/countries/images/' + country.name.trim().toLowerCase() + '_image' + path.extname(imageFileName)
            await country.save()
            return { id: country._id, name: country.name, code: country.code, image: country.image }
        } 
        catch (error) {
            console.log(error) 
        }  
    },

    updateCountryImage: async (id, imageFileName) => {
        try {
            let country = await Country.findById(id)
            if (!country) return null
            nameFile(countryImagesPath, imageFileName, 'image', country, 'name')
            return { id: country._id, image: country.image }
        } 
        catch (error) {
            console.log(error) 
        }  
    },

    deleteCountry: async (id) => {
        try {
            let country = await Country.findById(id)
            if (!country) return 0
            deleteCountryImage(country)
            await Country.findByIdAndDelete(id)
            country = await Country.findById(id)
            if (!country) return true
            else return 1
        } 
        catch (error) {
            console.log(error) 
        }
    }
    
}