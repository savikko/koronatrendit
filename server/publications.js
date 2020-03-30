Meteor.publish('questions', function() {

  
	return Questions.find({}, {sort: {netScore: -1}}); 
});

Meteor.publish('answerCounts', function() {
  return AnswerCounts.find();
});
