const mongoose = require("mongoose");


const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB Online!!');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar conexión a la base de datos')
    }
}


module.exports = {
    dbConnection
}