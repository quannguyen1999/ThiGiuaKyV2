var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
const { parse } = require('path');
require('dotenv').config()

const quanlysDao = require('../daos/quanlys.dao')
const dienviensDAO = require('../daos/dienviens.dao')

/* GET home page. */
router.get('/', async (req, res) => {
    const quanly = await quanlysDao.getAll();
    const dienviens = await dienviensDAO.getAll();
    res.render('index', { classes: quanly, dienviens:dienviens });
  });

  router.post('/quanlys/add', async (req, res) => {
    const classroom = {
      id: uuid.v1(),
      ma_quanly: req.body.ma_quanly,
      ten: req.body.ten
    }
    const success = await quanlysDao.add(classroom)
    if(success) {
      res.redirect('/')
    } else {
      res.status(400).send("Invalid")
    }
  })

  router.get('/quanlys/delete/:id', async (req, res) => {
    const ma_lop = req.params.id;
    const success = await quanlysDao.delete(ma_lop);
    if(success) {
      res.redirect('/')
    } else {
      res.status(400).send("Invalid")
    }
  });

  router.get('/quanlys/update/form/:id', async (req, res) => {
    const ma_lop = req.params.id;
    const classroom = await quanlysDao.getSingleById(ma_lop);
    res.render('quanlyFormUpdate', {
      classItem:classroom
    })
  })

  router.post('/quanlys/update/:id', async (req, res) => {
    const classroom = {
      ma_quanly: req.params.id,
      ten: req.body.ten,
    }
    const success = await quanlysDao.update(classroom);
    if(success) {
      res.redirect('/')
    } else {
      res.status(400).send("Invalid")
    }
  })

// 
// render student not api
router.get('/dienviens/delete/:id', async (req, res) => {
    const ma_sinhvien = req.params.id;
    const success = await dienviensDAO.delete(ma_sinhvien);
    if(success) {
      res.redirect('/')
    } else {
      res.status(500).send(err)
    }
  });
  
  router.post('/dienviens/add', async (req, res) => {
    const student = {
      id: uuid.v1(),
      ma_dienvien: req.body.ma_dienvien,
      ten_dienvien: req.body.ten_dienvien,
      hinh: req.body.hinh,
      tuoi: req.body.tuoi,
      avatar: req.body.avatar
    }
    const success = await dienviensDAO.add(student)
    if(success) {
      res.redirect('/')
    } else {
      res.status(400).send("Invalid")
    }
  })

  router.get('/dienviens/update/form/:id', async (req, res) => {
    const ma_sinhvien = req.params.id;
    const dienvien = await dienviensDAO.getSingleById(ma_sinhvien);
    const quanly = await quanlysDao.getAll();
    res.render('dienvienFormUpdate', {
      dienvien: dienvien,
      quanly: quanly
    })
  })

  router.post('/dienviens/update/:id', async (req, res) => {

    let files = req.files;
    let hinh = await files.hinh;
    const uploadS3 = await dienviensDAO.uploadAvatar(hinh);
    
    const student = {
      ma_dienvien: req.params.id,
      ten_dienvien: req.body.ten_dienvien,
      tuoi: req.body.tuoi,
      avatar:req.body.avatar,
      hinh: uploadS3
    }
    console.log(student)
    const success = await dienviensDAO.update(student);
    if(success) {
      res.redirect('/')
    } else {
      res.status(400).send("Invalid")
    }
  })
  module.exports = router;
  