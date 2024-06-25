const app = require('./app')
const connectToMongo = require('./config/db')

// handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

const port = 5000;
connectToMongo();

const server = app.listen(port, () => {
    console.log(` App started on port ${port}`);
})


// Unhandled Promise Rejection
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})