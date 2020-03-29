Meteor.methods({
  getSessionId: function() {
    return this.connection.id;
  },
  answer: function(question,answererID,answer) {
  	Answers.upsert(
  		{question: question, answerer: answererID},
  		{$set:{
  			question: question,
  			answerer: answererID,
  			answer: answer
  		 }
  		
  	});
  	return true;
  }
});