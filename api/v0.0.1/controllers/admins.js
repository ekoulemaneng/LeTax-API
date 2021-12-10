const Admin = require('../models/admins')
const { hashPassword, checkPassword } = require('../services/passwordUtils')

module.exports = {

    createAdmin: async (name, email, _password) => {
        try {
            let admin = await Admin.findOne({ email })
            if (admin) return null
            const hashedPassword = await hashPassword(_password)
            admin = await Admin.create({
                name,
                email,
                password: hashedPassword
            })
            return { id: admin._id }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getAdminById: async (id) => {
        try {
            const admin = await Admin.findById(id)
            if (!admin) return null
            return { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getAdminByEmail: async (email) => {
        try {
            const admin = await Admin.findOne({ email })
            if (!admin) return null
            return { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        } 
        catch (error) {
            console.error(error)
        }
    },

    getAllAdmins: async () => {
        try {
            const admins = await Admin.find()
            if (admins.length == 0) return null
            let newAdmins = []
            for (let i = 0; i < admins.length; i++) {
                const admin = admins[i]
                const newAdmin = { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
                newAdmins.push(newAdmin)
            }
            return newAdmins
        } 
        catch (error) {
            console.error(error)
        }
    },

    updateAdminName: async (email, name) => {
        try {
            let admin = await Admin.findOne({ email })
            if (!admin) return null
            admin.name = name
            await admin.save()
            return { id: admin._id, name: admin.name }
        } 
        catch (error) {
            console.error(error)
        }
    },

    updateAdminPassword: async (email, oldPassword, newPassword) => {
        try {
            let admin = await Admin.findOne({ email })
            if (!admin) return 0
            const isPasswordCorrect = await checkPassword(oldPassword, admin.password)
            if (!isPasswordCorrect) return 1
            admin.password = await hashPassword(newPassword)
            await admin.save()
            return true
        } 
        catch (error) {
            console.error(error)
        }
    },

    deleteAdmin: async (email, password) => {
        try {
            let admin = await Admin.findOne({ email })
            if (!admin) return 0
            const isPasswordCorrect = await checkPassword(password, admin.password)
            if (!isPasswordCorrect) return 1
            await Admin.findByIdAndDelete(id)
            admin = await this.getAdminById(id)
            if (!admin) return true
            else return 2
        } 
        catch (error) {
            console.error(error)
        }
    }

}