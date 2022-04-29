import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING
    },
    filename: {
        type: DataTypes.STRING
    },
    attributes: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    categoryname: {
        type: DataTypes.STRING
    }
});

export default Image;