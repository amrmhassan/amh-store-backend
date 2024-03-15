//! npm install body-parser
import './env.js';
import { app } from './app.js';
import db from './db.js';
import './middleWares/middleWares.js';

db.connectDB();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
