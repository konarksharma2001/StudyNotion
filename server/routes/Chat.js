const express = require("express")
const router = express.Router()
const {getAllMessagesController} = require("../controllers/Chat")

router.get("/getAllMessages",getAllMessagesController)

module.exports = router
