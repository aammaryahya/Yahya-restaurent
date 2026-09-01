const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const { getEmployees, updateEmployee, updatePassword } = require("../controllers/employeeController");


router.get("/", auth, role(["admin"]), getEmployees);

router.put("/:id", auth, role(["admin"]), updateEmployee);

router.put("/:id/password", auth, role(["admin"]), updatePassword);


module.exports = router