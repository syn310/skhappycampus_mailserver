const models = require('../api/model/models');

module.exports = () =>{
    return models.sync({force:false}); //테이블이 있으면 지우지 않음
};
