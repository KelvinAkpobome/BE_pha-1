/* eslint-disable no-console */
const connectDB = require('./config/db')
  
connectDB();

const app = require('./app');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));