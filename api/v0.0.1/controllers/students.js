const Student = require('../models/students')
const trackControllers = require('./tracks')
const { hashPassword, checkPassword } = require('../services/passwordUtils')

module.exports = {

    createStudent: async (name, email, _password) => {
        try {
            let student = await Student.findOne({ email })
            if (student) return null
            const hashedPassword = await hashPassword(_password)
            student = await Student.create({
                name,
                email,
                password: hashedPassword
            })
            return { id: student._id }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getStudentById: async (id) => {
        try {
            const student = await Student.findById(id)
            if (!student) return null
            return { id: student._id, name: student.name, email: student.email, role: student.role }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getStudentByEmail: async (email) => {
        try {
            const student = await Student.findOne({ email })
            if (!student) return null
            return { id: student._id, name: student.name, email: student.email, role: student.role, tracks: student.tracks }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getAllStudents: async () => {
        try {
            const students = await Student.find('-password -__v')
            if (students.length == 0) return null
            let newStudents = []
            for (let i = 0; i < students.length; i++) {
                const student = students[i]
                const newStudent = { id: student._id, name: student.name, email: student.email, role: student.role }
                newStudents.push(newStudent)
            }
            return newAdmins
        } 
        catch (error) {
            console.error(error)
        }
    },

    updateStudentName: async (email, name) => {
        try {
            let student = await Student.findOne({ email })
            if (!student) return null
            if (student.name != name) student.name = name
            await student.save()
            return { id: student._id, name: student.name }
        } 
        catch (error) {
            console.error(error)
        }
    },

    updateStudentPassword: async (email, oldPassword, newPassword) => {
        try {
            let student = await Student.findOne({ email })
            if (!student) return 0
            const isPasswordCorrect = await checkPassword(oldPassword, student.password)
            if (!isPasswordCorrect) return 1
            student.password = await hashPassword(newPassword)
            await student.save()
            return true
        } 
        catch (error) {
            console.error(error)
        }
    },

    addTrack: async (email, trackId) => {
        try {
            const student = await Student.findOne({ email })
            if (!student) return 0
            const track = await trackControllers.getTrackById(trackId)
            if (!track) return 1
            let tracksIds = [] 
            for (let i = 0; i < student.tracks; i++) tracksIds.push(student.tracks[i].id)
            if (tracksIds.indexOf(trackId) !== -1) return 2
            if (track.category == 'Exam') student.tracks.push({ id: track.id, name: track.name, category: track.category, diploma: track.diploma, country: track.country, description: track.description })
            else if (track.category == 'Contest') student.tracks.push({ id: track.id, name: track.name, category: track.category, school: track.school, country: track.country, description: track.description })
            await student.save()
            return student.tracks
        } 
        catch (error) {
            console.error(error)
        }
    },

    removeTrack: async (email, trackId) => {
        try {
            let student = await Student.findOne({ email })
            if (!student) return 0
            if (!(await trackControllers.getTrackById(trackId))) return 1
            let tracksIds = []
            for (let i = 0; i < student.tracks; i++) tracksIds.push(student.tracks[i].id)
            const index = tracksIds.indexOf(trackId)
            if (index == -1) return 2
            student.tracks.splice(index, 1)
            tracksIds = []
            for (let i = 0; i < student.tracks; i++) tracksIds.push(student.tracks[i].id)
            if (tracksIds.indexOf(trackId) !== -1) return 3
            await student.save()
            return student.tracks
        } 
        catch (error) {
            console.error(error)
        }
    },

    deleteStudent: async (email, password) => {
        try {
            let student = await Student.findOne({ email })
            if (!student) return 0
            if (!(await checkPassword(password, student.password))) return 1
            await Student.findOneAndRemove({ email })
            student = await Student.findOne({ email })
            if (!student) return true
            else return 2
        } 
        catch (error) {
            console.error(error)
        }
    }

}