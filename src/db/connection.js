require('dotenv').config();
const mongoose=require("mongoose");
const UserModel=require("../models/schema");
const express=require("express");
const app=express();
app.use(express.json());


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://bjrweatherforecast:BjrWeatherForecast@weather.jl5yz.mongodb.net/license?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,   
        });

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

connectDB();