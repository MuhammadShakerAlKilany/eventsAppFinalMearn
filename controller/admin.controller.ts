import { compare } from "bcrypt";
import AdminDao from "../dao/admin.dao";
import { Admin } from "../interfaces/admin.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose";
const adminDao = new AdminDao()
export const addAdmin = tryCatchErr<Admin>(async (req, res) => {
    const admin = req.body;
    const findAdmin = await adminDao.findAdminByEmail(admin.email)
    if (findAdmin) return res.status(400).json({ message: "email is used" });
    const { email, name, _id, isOwner } = await adminDao.createAdmin(admin);

    return res.json({ message: "creat new admin", data: { email, name, _id } })
})
export const loginAdmin = tryCatchErr<Admin>(async (req, res) => {
    const admin = req.body;
    const findAdmin = await adminDao.findAdminByEmail(admin.email)
    if (findAdmin) {
        const password = req.body.password
        const isCompare = await compare(password, findAdmin.password)
        console.log(isCompare)
        if (isCompare) {
            const { _id, name, email, isOwner } = findAdmin
            const token = jwt.sign({ email, name, _id, isOwner }, process.env.SECRET_KEY!, { expiresIn: "7 days" })
            return res.status(200).json({ message: "you log in", token, data: { _id, name, email, isOwner } })
        }
    }

    return res.status(404).json({ message: "email or password is wrong" })

})
export const getAll = tryCatchErr(async (req, res) => {
    const admins = await adminDao.getAllAdmin()
    return res.json({ message: "all admin", data: admins });
})
export const getAdmin = tryCatchErr<never, { _id: ObjectId }>(async (req, res) => {
    const admin = await adminDao.getAdmin(req.params._id)
    if (!admin) return res.status(404).json({ message: "not found admin" })
    return res.json({ message: "admin", data: admin })
})
export const edit = tryCatchErr<Admin, { _id: ObjectId }>(async (req, res) => {
    const adminId = req.params._id
    const data = req.body
    const admin = await adminDao.edit(adminId, data)
    if (!admin) return res.status(404).json({ message: "not found admin" })
    const { _id, name, email, isOwner } = admin
    return res.status(200).json({ message: "admin update", data: { _id, name, email, isOwner } })
}
)
export const deleteAdmin = tryCatchErr<never, { _id: ObjectId }>(async (req, res) => {
    const _id = req.params._id
    const admin = await adminDao.deleteAdmin(_id)
    if (!admin) return res.status(404).json({ message: "not found admin" })
    return res.json({ message: "admin deleted" })
})