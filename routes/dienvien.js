var express = require('express');
var router = express.Router();

const studentsDao = require('../daos/dienviens.dao')
var uuid = require('node-uuid');
require('dotenv').config()

// Get all
router.get('/dienviens', async (req, res) => {
    const students = await studentsDao.getAll();
    res.send(students);
  })

    // create new user
router.post('/dienviens', async (req, res) => {
    const student = {
      id: uuid.v1(),
      ma_dienvien: req.body.ma_dienvien,
      ten_dienvien: req.body.ten_dienvien,
      hinh: req.body.hinh,
      tuoi: req.body.tuoi,
      avatar: req.body.avatar
    }
    const success = await studentsDao.add(student)
    if(success) {
      res.send('Create Success');
    } else {
      res.status(400).send("Invalid")
    }
  })

 
router.put('/dienviens/:id', async (req, res) => {
    const student = {
        ma_dienvien: req.params.id,
      ten_dienvien: req.body.ten_dienvien,
      hinh: req.body.hinh,
      tuoi: req.body.tuoi,
      avatar: req.body.avatar
    }
    const success = await studentsDao.update(student);
    if(success) {
      res.send('Update Success');
    } else {
      res.status(400).send("Invalid")
    }
  })

  // delete user by ma_sinhvien
router.delete('/dienviens/:id', async (req, res) => {
    const ma_sinhvien = req.params.id;
    const success = await studentsDao.delete(ma_sinhvien);
    if(success) {
      res.send('Delete Success');
    } else {
      res.status(400).send("Invalid")
    }
  })


  // Get user by ma_lop
router.get('/dienviens/:id', async (req, res) => {
    const ma_lop = req.params.id;
    console.log(ma_lop)
    const classroom = await studentsDao.getSingleById(ma_lop);
    res.send(classroom);
  })

  module.exports = router;