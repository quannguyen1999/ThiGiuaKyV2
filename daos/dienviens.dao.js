var uuid = require('node-uuid');
var AWS = require("aws-sdk");
const BUCKET_NAME = 'kimquyen';

require('dotenv').config()
AWS.config.update({
  region: "ap-southeast-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();

const table = 'dienvien'

const getAll = async () => {
    var params = {
        TableName: table
      };
    return await (await docClient.scan(params).promise()).Items
}


const add = async (student) => {
    const options = {
      TableName: table,
      Item: student
    }
    return await docClient.put(options).promise().catch((err) => {
      console.log(err);
      return null
    })
  }

  const update = async (student) => {
      console.log(student)
    const options = {
      TableName: table,
      Key: {
        ma_dienvien: student.ma_dienvien
      },
      UpdateExpression: "set ten_dienvien = :ten_dienvien, hinh=:hinh, tuoi=:tuoi, avatar=:avatar",
      ExpressionAttributeValues:{
          ":ten_dienvien": student.ten_dienvien,
          ":hinh": student.hinh,
          ":tuoi": student.tuoi,
          ":avatar": student.avatar
      },
      ReturnValues:"UPDATED_NEW"
    }
    return await docClient.update(options).promise().catch((err) => {
      console.log(err);
      return null;
    })
  }

const deleteById = async (ma_dienvien) => {
    const options = {
      TableName: table,
      Key:{
       'ma_dienvien': ma_dienvien
      },
    }
    return await docClient.delete(options).promise().catch((err) => {
      console.log(err);
      return null;
    })
  } 

  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  });
  const uploadAvatar = async (avatar) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: avatar.name, // File name you want to save as in S3
      Body: avatar.data,
      ACL: "public-read",
    };
    return await (await s3.upload(params).promise()).Location
  }

  const getSingleById = async (ma_sinhvien) => {
    const options = {
      TableName: table,
      Key: {
        'ma_dienvien': ma_sinhvien
      }
    }
    return await (await docClient.get(options).promise()).Item
  }
  
  module.exports ={
    getAll: getAll,
    getSingleById: getSingleById,
    add: add,
    update: update,
    delete: deleteById,
    uploadAvatar: uploadAvatar
}

