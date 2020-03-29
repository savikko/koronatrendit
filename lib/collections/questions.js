Questions = new Mongo.Collection('questions');

Schemas.Questions = new SimpleSchema({
    question: {
        type: String,
        label: "Ilmiön kuvaus",
        max: 200
    },
    netScore: {
      type: Number,
      defaultValue: 0
    },
    answerCount: {
      type: Number,
      defaultValue: 0
    }
});

Questions.attachSchema(Schemas.Questions);

Questions.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    'update': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return false; 
    },
  });