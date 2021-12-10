const Track = require('../models/tracks')
const countryControllers = require('./countries')
const adminControllers = require('./admins')
const { checkPassword } = require('../services/passwordUtils')

const generateTrack = async (track) => {
    let newTrack = {}
    newTrack.id = track._id
    newTrack.name = track.name
    newTrack.category = track.category
    if (track.category == 'Exam') newTrack.diploma = track.diploma
    if (track.category == 'Contest') newTrack.school = track.school
    const country = await countryControllers.getCountryById(track.country) 
    if (country) newTrack.country = { id: track.country, name: country.name }
    newTrack.description = track.description
    return newTrack
}

const generateTracks = async (tracks) => {
    let newTracks = []
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        let newTrack = {}
        newTrack.id = track._id
        newTrack.name = track.name
        newTrack.category = track.category
        if (newTrack.category == 'Exam') newTrack.diploma = track.diploma 
        else if (newTrack.category == 'Contest') newTrack.school = track.school
        const country = await countryControllers.getCountryById(track.country) 
        if (country) newTrack.country = { id: track.country, name: country.name }
        newTrack.description = track.description
        newTracks.push(newTrack)
    }
    return newTracks
}

module.exports = {

    addTrack: async (name, category, diploma, school, country, description) => {
        try {
            console.log((await countryControllers.getCountryById(country)))
            if (!(await countryControllers.getCountryById(country))) return 0
            if (await Track.findOne({ name, category, country })) return 1
            if (diploma == '' && school == '') return 2
            let track
            if (category == 'Exam') track = await Track.create({ name, category, diploma, country, description })
            else if (category == 'Contest') track = await Track.create({ name, category, school, country, description })
            return { id: track._id }
        } 
        catch (error) {
            console.error(error)    
        }
    },

    getAllTracks: async () => {
        try {
            let tracks = await Track.find()
            if (tracks.length == 0) return null
            return await generateTracks(tracks)
        }
        catch (error) {
            console.error(error) 
        }
    },

    getTracksByCategoryAndCountry: async (category, country) => {
        try {
            let isCategory = category && category.replace(/\s/g, '') !== '' && ['Contest', 'Exam'].includes(category)
            let isCountry = country && country.replace(/\s/g, '') !== ''
            isCategory = isCategory ? true : false
            isCountry = isCountry ? true : false
            if (!isCategory && !isCountry) return 0
            else if (isCategory && !isCountry) {
                const tracks = await Track.find({ category })
                if (tracks.length == 0) return 1
                return await generateTracks(tracks)
            }
            else if (!isCategory && isCountry) {
                if (!(await countryControllers.getCountryById(country))) return 2
                const tracks = await Track.find({ country })
                if (tracks.length == 0) return 1
                return await generateTracks(tracks)
            }
            else {
                if (!(await countryControllers.getCountryById(country))) return 2
                const tracks = await Track.find({ category, country })
                if (tracks.length == 0) return 1
                return await generateTracks(tracks)
            }
        } 
        catch (error) {
            console.error(error) 
        }
    },

    getTrackById: async (id) => {
        try {
            const track = await Track.findById(id)
            if (!track) return 0
            const country = await countryControllers.getCountryById(track.country)
            if (!country) return 1
            return await generateTrack(track)
        } 
        catch (error) {
            console.error(error) 
        }
    },

    updateTrack: async (id, name, category, diploma, school, country, description) => {
        try {
            let track = await Track.findById(id)
            if (!track) return 0
            if (!(await countryControllers.getCountryById(country))) return 1
            if (name && name.replace(/\s/g, '') !== '' && name !== track.name) track.name = name
            if (category && category.replace(/\s/g, '') !== '' && ['Contest', 'Exam'].includes(category) && category !== track.category) track.category = category
            if (diploma && diploma.replace(/\s/g, '') !== '' && diploma !== track.diploma ) track.diploma = diploma
            if (school && school.replace(/\s/g, '') !== '' && school != track.school ) track.school = school
            if (country != track.country) track.country = country
            if (description && description.replace(/\s/g, '') !== '' && description !== track.description ) track.description = description
            await track.save()
            return await generateTrack(track)
        } 
        catch (error) {
            console.log(error) 
        }
    },

    deleteTrack: async (id, email, password) => {
        try {
            let track = await this.getTrackById(id)
            if (!track) return 0
            const admin = await adminControllers.getAdminByEmail(email)
            if (!admin) return 1
            const isPasswordCorrect = await checkPassword(password, admin.password)
            if (!isPasswordCorrect) return 2
            await Track.findByIdAndDelete(id)
            track = await this.getTrackById(id)
            if (!track) return true
            else return 3
        } 
        catch (error) {
            console.log(error) 
        }
    }

}