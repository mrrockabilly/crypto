const express = require('express');
// const morgan = require('morgan');
const PORT = process.env.PORT || process.argv[2] || 3000
const app = express();

// app.set('view engine', 'ejs');
// app.use(morgan('combined'));
// app.use(express.static(static folder))

//ROUTES
app.get('/', (req, res) => {
  console.log(`req for ${req.query.hash}`);
  res.send('ok');
})


app.listen(PORT, console.log('listening on port ' + PORT));