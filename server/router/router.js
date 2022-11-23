const express = require("express");
const router = express.Router();

const data = require("../dataSchemas/data");
data.connect();

const loginRoutes = require("./loginRoutes")(data);
const userRoutes = require("./userRoutes")(data);
const listRoutes = require("./listRoutes")(data);
const itemRoutes = require("./itemRoutes")(data);
const filteredItemRoutes = require("./filteredItemRoutes")(data);
const toolRoutes = require("./toolRoutes")(data);
const buyerListRoutes = require("./buyerListRoutes")(data);

router.use(express.json());
router.use(loginRoutes);
router.use(userRoutes);
router.use(listRoutes);
router.use(itemRoutes);
router.use(filteredItemRoutes);
router.use(toolRoutes);
router.use(buyerListRoutes);

module.exports = router;
