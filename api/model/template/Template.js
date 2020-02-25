const server = require('../models.js');
const Sequelize = require('sequelize');

const Template = server.define('svMailTemplate' , {
  //템플릿 번호
  templateNumber : {
    type : Sequelize.STRING(12),
    allowNull : false,
    primaryKey : true
  },
  //메일템플릿
  template : {
    type : Sequelize.TEXT('long')
  },
  //생성날짜
  createDatetime : {
    type : Sequelize.DATE,
    defaultValue : Sequelize.NOW
  },
  //생성자아이디
  createUserId : {
    type : Sequelize.STRING(300)
  },
  //수정날짜
  updateDatetime : {
    type :  Sequelize.DATE,
    defaultValue : Sequelize.NOW
  },
  //수정자아이디
  updateUserId : {
    type : Sequelize.STRING(300)
  }
}, {underscored:true});


module.exports =  {
    Template : Template
}
