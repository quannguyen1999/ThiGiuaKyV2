var express = require('express');
var uuid = require('node-uuid');
const classesDao = require('../daos/quanlys.dao');
var router = express.Router();

// Get all
router.get('/quanlys', async (req, res) => {
    const classes = await classesDao.getAll();
    res.send(classes);
  })

// create new class
router.post('/quanlys', async (req, res) => {
    const classroom = {
      id: uuid.v1(),
      ma_quanly: req.body.ma_quanly,
      ten: req.body.ten
    }
    const success = await classesDao.add(classroom)
    if(success) {
      res.send('Create Success');
    } else {
      res.status(400).send("Invalid")
    }
  })

  // delete class by ma_lop
router.delete('/quanlys/:id', async (req, res) => {
  const ma_quanly = req.params.id;
  const success = await classesDao.delete(ma_quanly);
  if(success) {
    res.send('Delete Success');
  } else {
    res.status(400).send("Invalid")
  }
})

  // update class by ma_lop
  router.put('/quanlys/:id', async (req, res) => {
    const classroom = {
      ma_quanly: req.params.id,
      ten: req.body.ten,
    }
    const success = await classesDao.update(classroom);
    if(success) {
      res.send('Update Success');
    } else {
      res.status(400).send("Invalid")
    }
  })

  module.exports = router;