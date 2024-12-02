// models/Shift.js
module.exports = (sequelize, DataTypes) => {
    const Shift = sequelize.define('Shift', {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Shift;
  };
  