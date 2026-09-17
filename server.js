import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/users.js';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:True})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());
app.use ('/api/users',userRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running live at ${PORT}`);
    
});
app.use('/api/users',userRoutes);
app.use((err, req, res, next)=> 
{
    console.error('Captured Error:',err.stack );
    res.status(500).json({
        success:false,
        message: 'An internal server error occurred.',
        error:err.message
    });
});
