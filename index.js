/* eslint-disable consistent-return */
//  imports
require('dotenv').config();
const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

// middlewares
app.use(cors());// if frontend and backend servers are different
app.use(express.static('build'));
morgan.token('data', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(express.json());

// api definitions
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch(() => console.log("couldn't fetch all persons from database"));
});

app.get('/api/persons/info', (request, response) => {
  Person.find({})
    .then((persons) => {
      const text = `Phonebook has ${persons.length} contacts </br> ${new Date()}`;
      response.send(text);
    })
    .catch(() => console.log("couldn't fetch all persons from database"));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const contact = new Person({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContacts) => {
    response.json(savedContacts);
  }).catch((err) => next(err));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;
  //  console.log(body);
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const runAsync = async () => {
    try {
      const doc = await Person.findById(request.params.id);
      doc.number = body.number;
      await doc.save();
      response.json(doc);
    } catch (err) {
      next(err);
    }
  };
  runAsync();
});

app.delete('/api/persons/:id', (request, response, next) => {
  const runAsync = async () => {
    try {
      await Person.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } catch (err) {
      next(err);
    }
  };
  runAsync();
});

const errorHandler = (error, request, response, next) => {
//   console.error(error.message);

  if (error.name === 'CastError') {
    // console.log('single person query error');
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    // console.log('missing fields');
    return response.status(400).json({ error: 'Invalid Number' });
  }

  next(error);
};
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
});
