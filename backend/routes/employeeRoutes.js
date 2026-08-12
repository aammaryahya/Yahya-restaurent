const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const { getEmployees, updateEmployee } = require("../controllers/employeeController");


router.get("/", auth, role(["admin"]), getEmployees);

router.put("/:id", auth, role(["admin"]), updateEmployee);

module.exports = router