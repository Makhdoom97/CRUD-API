const swaggerAutogen = require("swagger-autogen")();

const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi. goto /api/users to get started" });
});
require("./app/routes/user.routes")(app);
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

// const outputFile = './swagger_output.json'
// const endpointsFiles = ['./app/routes/user.routes.js']

// swaggerAutogen(outputFile, endpointsFiles)
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


