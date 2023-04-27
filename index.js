const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const upload = require('express-fileupload');
const cors = require('cors');
const route = require('./Routes/UserRoute');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(upload());

// Route Middlewares
app.use("/user", route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Connect to MongoDB and print the results
mongoose.connect(process.env.MONGO_URI, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
).then(() => console.log("Connected to MongoDB"));