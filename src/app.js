require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();
const { v4: uuid } = require('uuid');
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());


const address = [{
  'id': 'kgukyfukgil',
  'firstName': "Jackie",
  'lastName': "Bishop",
  'address1': "18 Some St",
  'address2': "Apt. 5",
  'city': "Philly",
  'state': "PA",
  'zip': "10101"
}]


app.get('/address', (req, res) => {
  res
    .json(address);
});

app.post('/address', (req, res) => {
  console.log(req.body);
  const { firstName, lastName, address1, address2=false, city, state, zip } = req.body;

  if (!firstName) {
    return res
      .status(400)
      .send('First Name required');
  }
  if (!lastName) {
    return res
      .status(400)
      .send('Last Name required');
  }
  if (!address1) {
    return res
      .status(400)
      .send('Address 1 required');
  }
  if (!city) {
    return res
      .status(400)
      .send('City required');
  }
  if (!state) {
    return res
      .status(400)
      .send('State required');
  }
  if(state.length!==2) {
    return res
      .status(400)
      .send('State must be two letter code');
  }
  if (!zip) {
    return res
      .status(400)
      .send('Zip required');
  }
  if (zip.length !==5 || typeof parseInt(zip) !== "number") {
    return res
      .status(400)
      .send('Zip must be a 5 digit number');
  }
  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  }

  address.push(newAddress);
  res
    .status(201).location(`http://localhost:8000/address/${id}`).json({id: id})
  res
    .send('All validation passed');
    
});


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});
app.delete('/address/:addressId', (req, res) => {
  const { addressId } = req.params;
  const index = address.findIndex(u => u.id === addressId);
  // make sure we actually find a user with that id
  if (index === -1) {
    return res
      .status(404)
      .send('User not found');
  }

  users.splice(index, 1);

  res.send('Deleted');
});

module.exports = app;
