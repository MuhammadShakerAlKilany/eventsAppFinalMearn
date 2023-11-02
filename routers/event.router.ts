import { Router } from "express"

const router = Router()
router.route("/").post().patch().delete()
export default router