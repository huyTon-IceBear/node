const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

router.get("/", (req, res) => {
    const measurements = req.app.db.get("measurements");

    res.send(measurements);
})

router.get("/:id", (req, res) => {
    const measurement = req.app.db.get("measurements").find( {id: req.params.id}).value();


    res.send(measurement);
})

router.post("/", (req, res) => {
    try{
        const measurement = {
            id: nanoid(idLength),
            ... req.body
        }

        req.app.db.get("measurements").push(measurement).write();
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
