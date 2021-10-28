module.exports = (sequelize, Sequelize) => {
    const TopicModel = sequelize.define('topic', {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey:true,
            allowNull:false
        },
        title: {
            type: Sequelize.STRING(50),
            allowNull:false
        },
        message: {
            type: Sequelize.TEXT,
            allowNull:false
        },
        url_image: {
            type: Sequelize.STRING(255)
        },
        user_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull:false
        },
        last_update: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },{
        modelName: 'Topic',
        timestamps: true,
        underscored: true
    }  
    )
    return TopicModel;
};
