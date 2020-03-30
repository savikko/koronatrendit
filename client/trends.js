Template.Trends.helpers({
  categories: function () {
    var allCategories = [];
    var allCategories = _.map(Questions.find().fetch(), function (value) {
      if (typeof value.categories !== "undefined") { return value.categories }
    });
    var flattenedCategories = _.flatten(allCategories);
    var falsesOutCategories = _.compact(flattenedCategories);
    var uniquedCategories = _.uniq(falsesOutCategories);
    var categories = _.map(uniquedCategories, function (value) {
      if (value) {
        return value;
      }
    });
    categories.push('Kategoriaa ei asetettu');
    return categories;
  },
  questions: function (category) {
    if (category === 'Kategoriaa ei asetettu') {
      questions = Questions.find({ categories: null });
    } else {
      questions = Questions.find({ categories: category });
    }
    return questions;

  },
  answercount: function (answer, question) {
    var answerObject = AnswerCounts.findOne({ answer: answer, question: question });
    if (answerObject) {
      return answerObject.answerCount;
    } else {
      return 0;
    }
  },
  totalanswers: function (question) {
    var totalAnswerers = 0;
    AnswerCounts.find({ question: question }).map(function (doc) {
      totalAnswerers += doc.answerCount;
    });
    return totalAnswerers;
  },
  offsetCount: function (netScore) {
    if (netScore === 0) {
      return "4";
    } else {
      var intScore = parseInt(netScore + 4);
      if (intScore < 0) {
        return "0";
      } else if (intScore > 8) {
        return "8";
      } else {
        return intScore.toString();
      }
    }
  },
  percent: function (answer, question) {
    answersCount = AnswerCounts.findOne({ answer: answer, question: question }).answerCount;
    var totalAnswerers = 0;
    AnswerCounts.find({ question: question }).map(function (doc) {
      totalAnswerers += doc.answerCount;
    });
    return Math.round(answersCount / totalAnswerers * 100);
  }
});

Template.Trends.events({
  'click .answer': function (event, template) {
    event.stopPropagation();
    currentTarget = event.currentTarget.dataset;
    answer = currentTarget.answer;
    question = currentTarget.question;
    console.log('questionid', question);
    answerer = Cookie.get('answerer');
    Meteor.call("answer", question, answerer, answer, function (error, result) {
      if (error) {
        console.log(error.reason);
      }
      else {
        return true;
      };
    });
  }
});


Template.Trends.rendered = function () {
  if (Cookie.get('answerer')) {
    //console.log('already been here');
  }
  else {
    document.cookie = 'answerer=' + Random.id();
  }
  Meteor.subscribe('answerCounts');
};