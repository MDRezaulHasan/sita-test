const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const lowDB = require("lowdb")
const productsRouter= require("./productRoutes")

//for swagger UI
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync")
const adapter = new FileSync("db.json")
const db = lowDB(adapter)

db.defaults({ products: []}).write()

//declaretion of swagger header
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "api-test",
			version: "1.0.0",
			description: "Demo project of rest api using nodejs and express hosted by Stockholm IT Academy (SITA)",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./*.js"],
};
const specs = swaggerJsDoc(options);
const app = express()

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use("/products",productsRouter)

app.listen(PORT,()=>console.log(`Server is running in port: ${PORT}`))