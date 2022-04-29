import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const UserImage = sequelize.define('UserImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    imageId: {
        type: DataTypes.INTEGER
    }
});

export default UserImage;