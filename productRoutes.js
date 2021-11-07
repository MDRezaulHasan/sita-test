const express = require("express")
const router = express.Router()
const {nanoid} = require("nanoid")
const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - catagory
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The product name
 *         catagory:
 *           type: string
 *           description: The catagory name
 *         price:
 *           type: string
 *           description: Price of the product
 *       example:
 *         name: Iphone 11
 *         catagory: Mobile
 *         price: 2000 
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", (req,res)=>{
    const products = req.app.db.get("products")
    res.send(products)
})

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The book was not found
 */
router.get("/:id", (req,res)=>{
    const product = req.app.db.get("products").find({id:req.params.id}).value()
    res.send(product)
})

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new book
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

router.post("/", (req,res)=>{
    try{
        const product ={
            id:nanoid(idLength),
            ...req.body
        }
        req.app.db.get("products").push(product).write();
        res.send(product)

    }catch(error){
        return res.status(500).send(error)
    }
})

/**
 * @swagger
 * /products/{id}:
 *  put:
 *    summary: Update the product by the id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The product was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Server error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("products")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("products").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 * 
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */
router.delete("/:id", (req, res) => {
    console.log("Id: "+req.params.id.toString())
	req.app.db.get("products").remove({ id: req.params.id.toString()}).write();

	res.sendStatus(200);
});

module.exports = router;