$(document).ready(function () {
    // Initialize MongoClient
    const MongoClient = require('mongodb').MongoClient;
    // import { MongoClient } from 'mongodb';
    const uri = "mongodb+srv://admin:admin@cluster0.vwge6wk.mongodb.net/test";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Array to store quiz questions
    var questions = [];

    // Event listener for "Add Question" button
    $("#add-question").on("click", function () {
        // Prompt user to enter question and points
        var question = prompt("Enter the question:");
        var points = parseInt(prompt("Enter the points for this question:"));

        // Prompt user to enter 4 options for the question
        var options = [];
        for (var i = 0; i < 4; i++) {
            var option = prompt("Enter option " + (i + 1) + ":");
            options.push(option);
        }

        // Prompt user to choose correct option
        var correctOption = parseInt(prompt("Enter the number of the correct option (1-4):"));

        // Add question to array
        questions.push({ question: question, options: options, correctOption: correctOption, points: points });

        // Display questions in HTML
        var questionList = "";
        for (var i = 0; i < questions.length; i++) {
            questionList += "<div class='form-group'><label><strong>Question " + (i + 1) + ":</strong></label><input type='text' class='form-control' value='" + questions[i].question + "'><br><label><strong>Options:</strong></label><br>";
            for (var j = 0; j < 4; j++) {
                questionList += "<input type='radio' name='q" + i + "' value='" + j + "'";
                if (j == questions[i].correctOption) {
                    questionList += " checked";
                }
                questionList += "> " + questions[i].options[j] + "<br>";
            }
            questionList += "<label><strong>Points:</strong></label><input type='number' class='form-control' value='" + questions[i].points + "'></div>";
        }
        $("#quiz-questions").html(questionList);
    });

    // Event listener for "Submit Quiz" button
    $("#submit-quiz").on("click", function () {
        // Get quiz title from input field
        var quizTitle = $("#quiz-title").val();

        // Calculate user's score
        var score = 0;
        for (var i = 0; i < questions.length; i++) {
            var selectedOption = $("input[name='q" + i + "']:checked").val();
            if (selectedOption != null && parseInt(selectedOption) == questions[i].correctOption) {
                score += questions[i].points;
            }
        }

        // Connect to MongoDB
        client.connect(err => {
            if (err) {
                console.log(err);
                alert('An error occurred. Please try again later.');
            } else {
                const collection = client.db("quizapp").collection("quizzes");
                const quiz = { title: quizTitle, questions: questions, score: score };

                // Insert quiz into MongoDB
                collection.insertOne(quiz, (err, result) => {
                    if (err) {
                        console.log(err);
                        alert('An error occurred. Please try again later.');
                    } else {
                        alert('Quiz submitted successfully.');
                    }
                });
            }
        });
    });
});
