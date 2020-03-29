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
  },
  categories: {
    type: [String],
    label: "Ilmiön kategoria",
    optional: true,
    autoform: {
      type: "universe-select",
      afFieldInput: {
        type: "universe-select",
        multiple: true,
        createSlug: false,
        options: function () {
          var allCategories = [];
          var allCategories = _.map(Questions.find().fetch(), function (value) {
            if (typeof value.categories !== "undefined") { return value.categories }
          });
          var flattenedCategories = _.flatten(allCategories);
          var falsesOutCategories = _.compact(flattenedCategories);
          var uniquedCategories = _.uniq(falsesOutCategories);
          var options = _.map(uniquedCategories, function (value) {
            console.log('value', value);
            if (value) {
              return {
                label: value, value: value
              }
            }
          });
          console.log('options', options);
          return options;

        }
      }
    }
  }
});

Questions.attachSchema(Schemas.Questions);

Questions.allow({
  'insert': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'update': function (userId, doc, fieldNames) {
    /* allow only categories change */
    if (fieldNames.length === 1) {
      console.log('only one field is about to be updated');
      if (fieldNames[0] === 'categories') {
        console.log('and that one field is categories');
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
});