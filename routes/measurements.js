const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *      Measurement:
 *          type: object
 *          required:
 *              - timestamp
 *              - latitude
 *              - longitude
 *              - country
 *              - type
 *              - result
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id of the measurement
 *              timestamp:
 *                  type: string
 *                  description: the timestamp of the measurement
 *              latitude:
 *                  type: string
 *                  description: the latitude of the measurement
 *              longitude:
 *                  type: string
 *                  description: the longitude of the measurement
 *              country:
 *                  type: string
 *                  description: the country of the measurement
 *              type:
 *                  type: string
 *                  description: the type of the measurement
 *              result:
 *                  type: string
 *                  description: the result of the measurement
 *          example:
 *              id:iEud_JoL
 *              timestamp:01012020
 *              latitude:53
 *              longitude:30
 *              country:America
 *              type:1
 *              result:Bad
 */


/**
 * @swagger
 * tags:
 *  name: Measurements
 *  descriptrion: The Measurements managing API
 */


/**
 * @swagger
 * /measurements:
 *  get:
 *      summary: Returns the list of all the measurements
 *      tags: [Measurements]
 *      responses:
 *          200:
 *              description: The list of the measurements
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Measurement'
 *                              
 */

router.get("/", (req, res) => {
    const measurements = req.app.db.get("measurements");

    res.send(measurements);
})


/**
 * @swagger
 * /measurements/{id}:
 *  get:
 *      summary: Get the measument by id
 *      tags: [Measurements]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The measurement id
 *      responses:
 *          200:
 *              description: The measurement description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Measurement'
 *          404:
 *              description: The measurement was not found
 *                              
 */
router.get("/:id", (req, res) => {
    const measurement = req.app.db.get("measurements").find( {id: req.params.id}).value();

    if(!measurement){
        res.sendStatus(404);
    }
    res.send(measurement);
})


/**
 * @swagger
 * /measurements:
 *  post:
 *      summary: Create a new measument
 *      tags: [Measurements]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Measurement'
 *      responses:
 *          200:
 *              description: The measurement was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Measurement'
 *          500:
 *              description: Some server error
 *                              
 */
router.post("/", (req, res) => {
    try{
        const measurement = {
            id: nanoid(idLength),
            ... req.body
        }

        req.app.db.get("measurements").push(measurement).write();
        res.send(measurement);
    } catch(error){
        return res.status(500).send(error);
    }
})

router.get("/:id", (req, res) => {
    try{
    req.app.db.get("measurements").find( {id: req.params.id}).assign(req.body).write();

    res.send(req.app.db.get("measurements").find( {id:req.params.id}));
    } catch(error){
        return res.status(500).send(error);
    }

})

router.delete("/:id", (req, res) => {
    req.app.db.get("measurements").remove({id: req.params.id}).write();
   
    res.sendStatus(200);
})

module.exports = router;
