const DataTypes = require('sequelize');
const sequelize = require('../connection.js');

const itemStructure = sequelize.define('Item', {
    title: { type: DataTypes.STRING, allowNull: false },
    desc: { type: DataTypes.TEXT },
    price: { type:DataTypes.DOUBLE },
    img: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
});


module.exports = itemsStructure;