
AnswerCounts.remove({}); // Clear answercounts on start 
Questions.update({}, { $set: { answerCount: 0, netScore: 0 } }, { multi: true });

Answers.find().observe({
  changed: function (newDocument, oldDocument) {
    console.log('old answer', oldDocument.answer);
    console.log('new answer', newDocument.answer);
    AnswerCounts.upsert(
      {
        "question": oldDocument.question,
        "answer": oldDocument.answer
      },
      {
        $inc: { answerCount: -1 }
      }
    );
    AnswerCounts.upsert(
      {
        "question": newDocument.question,
        "answer": newDocument.answer
      },
      {
        $inc: { answerCount: 1 }
      }
    );

    if (newDocument.answer === '+') {
      console.log('+ was answered');
      if (oldDocument.answer === '-') {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: 2 }
          }
        )
      } else {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: 1 }
          }
        )
      }
    }

    if (newDocument.answer === '-') {
      console.log('- was answered');
      if (oldDocument.answer === '+') {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: -2 }
          }
        )
      } else {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: -1 }
          }
        )
      }
    }

    if (newDocument.answer !== '-' && newDocument.answer !== '+') {
      console.log('not + or - was answered');
      if (oldDocument.answer === '+') {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: -1 }
          }
        )
      } else if (oldDocument.answer === '-') {
        Questions.update(
          {
            "_id": newDocument.question
          },
          {
            $inc: { netScore: 1 }
          }
        )
      }
    }
  }
});

Answers.find({}).observeChanges({
  changed: function (id, fields) {
    console.log("Changed vote: " + id + " Question: " + fields.question + " Answer: " + fields.answer);
  },
  added: function (id, fields) {
    console.log("New vote: " + id + " Question: " + fields.question + " Answer: " + fields.answer);
    AnswerCounts.upsert(
      {
        "question": fields.question,
        "answer": fields.answer
      },
      {
        $inc: { answerCount: 1 }
      }
    );
    if (fields.answer === '+') {
      Questions.update(
        {
          "_id": fields.question
        },
        {
          $inc: { netScore: 1, answerCount: 1 }
        }
      )
    } else if (fields.answer === '-') {
      Questions.update(
        {
          "_id": fields.question
        },
        {
          $inc: { netScore: -1, answerCount: 1 }
        }
      )
    } else {
      Questions.update(
        {
          "_id": fields.question
        },
        {
          $inc: { answerCount: 1 }
        }
      )
    }
  }
});