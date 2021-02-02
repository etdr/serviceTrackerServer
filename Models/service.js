

const { DataTypes } = require('sequelize')

const { serviceTypes, serviceStatuses, serviceHours } = require('../parameters')

module.exports = require('../Db').define('service', {
  date: {
    type: DataTypes.STRING
  },
  typeOfService: {
    type: DataTypes.STRING,
    validate: {
      isIn: [serviceTypes]
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hours: {
    type: DataTypes.INTEGER,
    validate: {
      isIn: [serviceHours]
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [serviceStatuses]
    },
    defaultValue: 'Pending'
  }
})




















// module.exports=(sequelize, DataTypes) =>{
//     const Service= sequelize.define('service', {
//         date:{
//             type:DataTypes.STRING,
//             // allowNull: false,
//             // validate:{notEmpty:true}
//         },
//         typeOfService:{
//             type:DataTypes.STRING,
//             // allowNull:false,
//             // validate:{notEmpty:true}
//         },
//         description:{
//             type:DataTypes.STRING,
//             allowNull:false
//         },
//         hours:{
//             type:DataTypes.INTEGER,
//             // allowNull:false,
//             // validate:{notEmpty:true},
    
//         },
       

//         status:{
//             type:DataTypes.STRING,
//             allowNull:true
//         }

        
//     })
//     return Service
// }