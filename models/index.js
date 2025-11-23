const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path'); // 읽을 파일 경로
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // config 설정들 불러옴

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename); // /index
fs
  .readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
  .filter(file => { // (.으로 시작하는)숨김 파일, index.js, js 확장자가 아닌 파일 필터링
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => { // 해당 파일의 모델 불러와서 init
    const model = require(path.join(__dirname, file)); // 모델 폴더 안에 있는 것들 불러옴
    console.log(file, model.name);
    db[model.name] = model; // 모델 폴더 안에 있는 파일들을 db 안에 넣음
    model.initiate(sequelize); // 모델 폴더 안에 있는 파일들을 init
  });

Object.keys(db).forEach(modelName => { // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;