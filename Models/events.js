
const { DataTypes } = require('sequelize')


module.exports = require('../Db').define('event', {
    date: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    hours: {
        type: DataTypes.INTEGER,
        validate: 
    }
})





// module.exports = (sequelize, DataTypes) =>{
//     const Events= sequelize.define('events', {
//         date:{
//             type:DataTypes.STRING,
//             // allowNull: false,
//             // validate:{notEmpty:true}
//         },
    
//         description:{
//             type:DataTypes.STRING,
//             // allowNull:false
//         },
//        location:{
//             type:DataTypes.STRING,
//             // allowNull:true
//         },    
//         title:{
//             type:DataTypes.STRING,
//             // allowNull:false
//         },  
      

//         hours:{
//             type:DataTypes.INTEGER,
//             // allowNull:true,
//             // validate:{notEmpty:true},
    
//         }

        
//     })
//     return Events
// }