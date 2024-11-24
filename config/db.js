const mongoose = require('mongoose');
const dotenv =require('dotenv');

dotenv.config({path:'./config.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_CONNECTION}/blog-personal`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

