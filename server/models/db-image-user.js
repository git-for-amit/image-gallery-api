import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const UserImage = sequelize.define('UserImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: DataTypes.INTEGER
    },
    imageid: {
        type: DataTypes.INTEGER
    }
});

export default UserImage;