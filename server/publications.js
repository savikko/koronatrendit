Meteor.publish('questions', function() {

  
	return Questions.find({}, {sort: {answerCount: -1}}); 
});

Meteor.publish('answerCounts', function() {
  return AnswerCounts.find();
});
