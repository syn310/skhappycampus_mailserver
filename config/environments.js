require('dotenv').config();

const environments = {
    development : {
      mysql: {
        username : process.env.localusername,
        password : process.env.localpassword,
        database : process.env.localdb,
        host : process.env.localhost,
        port : process.env.localport
      },
      resturl:{
        coverletter : process.env.localcoverletter
      }
    },


    production: {
      mysql: {
        username : process.env.dbusername,
        password : process.env.dbpassword,
        database : process.env.database,
        host : process.env.dbhost,
        port : process.env.port
      },
      resturl:{
        coverletter : process.env.coverletter
      }
    }
}


const nodeEnv = process.env.node_env || 'development';

module.exports = environments[nodeEnv];
