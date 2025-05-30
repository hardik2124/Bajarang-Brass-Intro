const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const fileUpload = require('express-fileupload');
const hpp = require('hpp');
const morgan = require('morgan');
require('dotenv').config();
const databaseConnection = require("./config/DatabaseConnection");
const cloudinaryConnect = require("./config/Cloudinary");
const authRoutes = require("./routes/authRoutes");

// Database and cloudinary Connection
databaseConnection.DBConnection();
cloudinaryConnect.cloudinaryConnect();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(hpp());
app.use(express.json());
// app.use(mongoSanitize());
app.use(limiter);

// app.use(cors({
//     origin: ["http://localhost:3000","http://localhost:3001"], // add allowed origins
//     credentials: true,
// }));

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin); // Allow all origins dynamically
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));


app.use(cookieParser());
app.use(morgan('combined')); // or 'tiny' and combined

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)



// Routes
app.use("/api/v1/auth", authRoutes);












//server listening
app.listen(process.env.PORT || 6000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
            <title>Welcome</title>
            <style>
                body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                }
                h1 {
                font-style: italic;
                color: #333;
                }
            </style>
            </head>
            <body>
            <h1><u><i>Welcome to the<b> bajarang brass india</b> server!</i></u></h1>
            </body>
        </html>
    `);

})

