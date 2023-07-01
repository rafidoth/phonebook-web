const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://pbrafi123:${password}@phonebook.xhsmo17.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema);
// const person = new Person({
//   name : process.argv[3],
//   number : process.argv[4]
// })

// const runAsyncAdd = async () =>{
//     await person.save();
//     console.log('contact saved')
//     mongoose.connection.close()
// }

// const runAsyncFetch = async () =>{
//     const persons  =  await Person.find({});
//     console.log("phonebook")
//     persons.forEach(person=>{
//         console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
// }

// if(process.argv.length === 3){
//     runAsyncFetch();
// }else{
//     runAsyncAdd();
// }
