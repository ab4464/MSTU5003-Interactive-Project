/***************************************
Support Resources Navbar - popover()
***************************************/

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    ({
        html: true,
        placement: "top",
        trigger: "hover", 
        viewport: ".container"
    });
});

/***************************************
Student Data - Arrays and Objects
***************************************/

var student = {
    name: "",
    email: "",
    date: "",
    acceptTerms: false,
    submitted: false,
    completion: "0%"
};

// each answer is an object with three properties (question, answer, hint)
// each student object is assigned the "responses" property which is given the value of an empty array
// as students answer questions, objects are created and pushed to the array (updating student.responses after each question)
// then add each student object to the whole class array (global variable, updated when students hit "submit" button) 

/*****************************************************
Test Problems Data - array storing 'question' objects

- each problem is saved as an object with 5 properties (question number, question text, answer, hint, and (eventually) user's answer)
- each student object is assigned the "answerUser" property which is given the value of an empty array
- as students answer questions, objects are created and pushed to the array (updating student.answerUser after each question)
*****************************************************/

var problems = [                                        // initialize array
    {                                                   // store question number, text, answer, hint, and (eventually) user's answer
        number: "1",
        question: "Change the OL tags to UL tags in the HTML code. What happens when you do that?", 
        answerKey: ["Option 0", "The numbered list will become a bulletted, ordered list."],
        hint: false,
        answerUser: []
    },
    {
        number: "2",
        question: "Make a new list of the top 3 things cats love and copy-paste your html code here.", 
        answerKey: ["Option 0", "Use an ordered list for the TOP 3 THINGS cats love."],
        hint: false,
        answerUser: []
    }, 
    {
        number: "3",
        question: "Delete the closing H3 tag in the 'intro' section. What happens when you do that?<br>Select the answer that most accurately describes the change in output.", 
        answerKey: ["Option 1", "The text in the 'intro' section changes from normal to bold font."],
        hint: false,
        answerUser: []
    },
    {
        number: "4",
        question: "Change the value of the text-decoration attribute for the h4, h5, and h6 elements from underline to none. What happens when you do that? Select best answer from the dropdown menu.", 
        answerKey: ["Option 4", "Both the 'Grumpy Cat' text and the 'Nyan Cat' text are no longer underlined."],
        hint: false,
        answerUser: []
    },
    {
        number: "5",
        question: "Add another CSS styling rule to the h1, h2, h3, h4, h5, and h6 elements. Right below font-weight: bold; you should type font-style: oblique; What happens when you add this styling rule? Select all that apply by holding down the command/option key.", 
        answerKey: [["Option 2", "The 'Top 3 things cats hate' list becomes italicized."], ["Option 3", "The section titles, 'Introduction to Cats' and 'Cats Opinions' become italicized."]],
        hint: false,
        answerUser: []
    }, 
    {
        number: "6",
        question: "How would you change the color of the title, Meow meow meow meow? Copy-paste your CSS code here.", 
        answerKey: ["Option 0", "#title { color: blue;}"], 
        hint: false,
        answerUser: []
    }
];

console.log("problems array initially = " + problems);

function changeAnswerToString(arrayAnswer) {
    var stringAnswer = "";
    if (typeof(arrayAnswer[0]) === "string" && arrayAnswer.length === 2) {         // instances where answerUser = [string, string] (problems 1-4 and 6)
        if (arrayAnswer[0] === "Option 0") {
            stringAnswer += arrayAnswer[1];
        }                                                                          
        else {
            stringAnswer += arrayAnswer[0] + ": " + arrayAnswer[1];
        }
    }
    else {                                                                         // instances where answerUser = [ [string, string] , [string, string] ] (problem 5)
        for (choice of arrayAnswer) {
            stringAnswer += choice[0] + ": " + choice[1] + "  ";
        }
    }
    return stringAnswer;
}

function formatRadioButtonVal(optionOld) {
    var newOption = "";
    var counter = 0;
    for (char of optionOld) {
        if (counter < 1) {
            newOption += char.toUpperCase();                                        // change first letter lowercase "o" to capital "O"
        }
        else if (counter === (optionOld.length - 1)) {                              // add blank space between "option" and number at end of string
            newOption += " " + char;
        }
        else {                                                                      // otherwise use whatever character was there before
            newOption += char;
        }
        counter += 1
    }
    return newOption;
}

function compareTwoArrays(array1, array2) {
    if (array1 === array2) {                        // quick preliminary check
        return true;
    }    
    if (array1 == null || array2 == null) {         // quick preliminary check
        return false;
    }
    if (array1.length !== array2.length) {          // quick preliminary check
        return false;
    }
    
    for (var i = 0; i < array1.length; ++i) {       // now search array item by item
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;                                    // return TRUE if could not find any differences
}

function evaluateUserAnswer(problem) {
    var scoreString = "You are ";
    var countCorrect = 0;
    var identicalArrays = false;
    var userAnswer = problem.answerUser;
    var correctAnswer = problem.answerKey;
    
    if (correctAnswer[0] === "Option 0") {          // written response scores are still To Be Determined
        return "Mr. Bloom will grade written responses separately.";
    }
    
    if (typeof(userAnswer[0]) === 'object') {      // must be a select-multiple question
        for (var i = 0; i < userAnswer.length; i++) {
            for (var j = 0; j < correctAnswer.length; j++) {
                identicalArrays = compareTwoArrays(correctAnswer[j], userAnswer[i]);
                if (identicalArrays === true) {
                    countCorrect += 1;
                }
            }
        }
    }
    else {
        identicalArrays = compareTwoArrays(correctAnswer, userAnswer);
        if (identicalArrays === true) {
            countCorrect = 1;
        }
    }
    
    if (countCorrect === correctAnswer.length) {
        scoreString += "correct! " + String(countCorrect) + " / " + String(correctAnswer.length) + " points";
    }
    else if (typeof(correctAnswer[0]) !== 'object') {
        if (countCorrect === 1 && correctAnswer.length === 2) {
            scoreString += "correct! " + String(countCorrect) + " / 1 points";
        }
        else {
            scoreString += "incorrect! 0 / 1 points";
        }
    }
    else {
        scoreString += "incorrect. 0 / " + String(correctAnswer.length) + " points"; 
    }
    return scoreString;
}


/******************************************************
Display User Submission - create new window + HTML tags 
******************************************************/
function displayAnswers() {
    var DispWin = window.open('','NewWin', 'toolbar=no, status=no, width=1050, height=880');
    var message = "";
    
    // HTML HEADER
    message += "<head><title>Mr. Bloom's Computer Science Class</title>";
    message += "<link type='text/css' rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>";
    message += "<link type='text/css' rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>";
    message += "<link type='text/css' rel='stylesheet' href='styles/studentStyle.css'/>";
    message += "</head>";

    // HTML BODY
    message += "<body>" + "<div class='container-fluid'>" + "<div class='container-top'>" + "<div class='page-header'>";              // TOP CONTAINER
    message += "<h1 id='title'>Introduction to HTML and CSS</h1><h3 id='subtitle'>Web-Development, Fall 2017</h3></div>" + "</div>";
    message += "<div class='container-main'>" + "<section id='results-window'>" + "<div class='row'>" + "<div class='col-xs-12'>";
    message += "<h3>Thank you for completing this assignment. Please " + "<input type=button name=print value='save' onClick='window.print()'>";
    message += " this receipt for your records.</h3></div></div>";
    message += "<hr><div class='row'>" + "<div class='col-xs-12'>" + "<h2>Student Info</h2></div></div>"; 
    message += "<div class='row'>" + "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Name:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.name + "</h3></div></div></div>";
    message += "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Email:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.email + "</h3></div></div></div>";
    message += "<div class='col-xs-4'>" + "<div class='row'>" + "<div class='col-xs-4'>";
    message += "<h3><b>Date:</b></h3></div>" + "<div class='col-xs-8'><h3>" + student.date + "</h3></div></div></div></div>";
    message += "<hr><div class='row'>" + "<div class='col-xs-12'><h2>" + document.querySelector("#lesson-title").innerText +"</h2></div></div><br>";
    
    var answerUserString = "INCOMPLETE";
    var answerKeyString = "INCOMPLETE";
    
    for (problem of problems) {
        if (typeof(problem.answerUser) !== "string") {
            answerUserString = changeAnswerToString(problem.answerUser);
        }
        if (typeof(problem.answerKey) !== "string") {
            answerKeyString = changeAnswerToString(problem.answerKey);
        }
        
        var problemScoreString = evaluateUserAnswer(problem);
        
        message += "<div class='row'>" + "<div class='col-xs-2'>" + "<b>Question " + problem.number + "</b></div>";
        message += "<div class='col-xs-1'>" + "<i class='fa fa-lg fa-question pull-right' aria-hidden='true'></i></div>";
        message += "<div class='col-xs-9'>" + problem.question + "</div></div><hr>";
        message += "<div class='row'>" + "<div class='col-xs-2'>" + "<b>Your Answer</b></div>";
        message += "<div class='col-xs-1'><i class='fa fa-lg fa-pencil pull-right' aria-hidden='true'></i></div>";
        
        // IF user is neither correct or incorrect bec/ it's a Written Response problem, italicize unscored field
        if (problemScoreString.includes("incorrect") === false && problemScoreString.includes("correct") === false) {
            message += "<div class='col-xs-9'>" + answerUserString + "</div></div><hr>";
            message += "<div class='row'><div class='col-xs-2'>" + "<b>Correct Answer</b></div>";
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-pencil pull-right' aria-hidden='true'></i></div>";
            message += "<div class='col-xs-9'>" + answerKeyString + "</div></div><hr>";
            message += "<div class='row'><div class='col-xs-2'>" + "<b>Score</b></div>";
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-star pull-right' aria-hidden='true'></i></div>";
            message += "<div class='col-xs-9'><em>" + problemScoreString + "</em></div></div><hr><br>";
        }
        else {
            message += "<div class='col-xs-8'>" + answerUserString + "</div><div class='col-xs-1'>";
            if (problemScoreString.includes("incorrect") === false) {
                message += "<i class='fa fa-lg fa-check-square-o pull-right' aria-hidden='true'></i></div></div><hr>";
            }
            else {          // IF user is incorrect, display "Correct Answer" field so they can see what they did wrong
                message += "<i class='fa fa-lg fa-square-o pull-right' aria-hidden='true'></i></div></div><hr>";
                message += "<div class='row'><div class='col-xs-2'>" + "<b>Correct Answer</b></div>";
                message += "<div class='col-xs-1'><i class='fa fa-lg fa-pencil pull-right' aria-hidden='true'></i></div>";
                message += "<div class='col-xs-9'>" + answerKeyString + "</div></div><hr>";
                
            }
            message += "<div class='row'><div class='col-xs-2'>" + "<b>Score</b></div>";
            message += "<div class='col-xs-1'><i class='fa fa-lg fa-star pull-right' aria-hidden='true'></i></div>";
            message += "<div class='col-xs-9'>" + problemScoreString + "</div></div><hr><br>";
        }
    }
    message += "</section>" + "</div>" + "</div>" + "</body>";

    DispWin.document.write(message);
    DispWin.print();
}

/***************************************************
Update Database - save user answer
***************************************************/
function updateData(response) {
    var allAnswers = [];
    if ( typeof(response[0]) === 'object' ) {                               // must be a select-multiple question
        for (question of problems) {                                        // search database for matching question number
            if (question.number === response[0][0]) {
                for (selected of response) {                                // loop over all selected responses
                    var userChoice = selected[1];
                    var choiceText = selected[2];
                    var tmpAnswer = [userChoice, choiceText];   
                    allAnswers.push(tmpAnswer);                              // add each answer to an array
                    console.dir(allAnswers)
                }
                question.answerUser = allAnswers;                            // after all answers added to array, update database
                return true;                                                 // return "true" bec/ update was successfull
            }
        }
        return false;                                                        // return false bec/ update was unsuccessfull
    }
    else {
        var questionNum = response[0];
        var userChoice = response[1];
        var choiceText = response[2];
        for (question of problems) {
            if (question.number === response[0]) {
                question.answerUser = [userChoice, choiceText];
                return true;
            }
        }
        return false;
    }
}

/*****************************
Retrieve Answer from Webpage
*****************************/
function getAnswer(event) {                        
    var inputType = event.target.type;                                  // need to know type of input (text, multiple-choice)...
    var question, option, value;                                        // ...so can format user response accordingly
    var userAnswer = [];
                                                                        // get user answer from Event properties...
    if (inputType === "text" || inputType === "textarea") {             // ...and format their response for database entry
        question = event.target.id;
        question = question.slice(-1);                                  
        option = "Option 0";                                             // no options because not a multiple-choice problem
        value = event.target.value;
        userAnswer = [question, option, value];                         
    }
    else if (inputType === "radio") {                                   // multiple choice
        question = event.target.id;
        question = question.slice(-1);                                  // question number
        option = formatRadioButtonVal(event.target.value);              // get user selection = "option3" or "option1" right now, but needs a space + a capital
        console.log("Option radio = " + option);
        value = event.target.parentElement.innerText;                   // get text associated with selection
        userAnswer = [question, option, value];                         // format user answer
    }
    else if (inputType === "select-one") {                              // get and format response for drop-down menu choice
        question = event.target.id;
        question = question.slice(-1);                                  
        option = "Option " + (event.target.selectedIndex + 1);
        value = event.target.value;
        userAnswer = [question, option, value];
    }
    else if (inputType === "select-multiple") {                         // get and format response for multiple selected response 
        var answers = [];
        for (i = 0; i < event.target.length; i++) {
            if (event.target.children[i].selected === true) {
                question = event.target.id;
                question = question.slice(-1);                         
                option = "Option " + (i+1);
                value = event.target.children[i].value;
                var tmpAnswer = [question, option, value];             
                answers.push(tmpAnswer);
            }
        }
        userAnswer = answers;
    }
    else {
        console.log("input type is not recognized");
    }
    return userAnswer;
}

function setAnswer(event) {                                             // delegate tasks to helper functions
    var userAnswer = getAnswer(event);                                  // first, get the answer from the Event object and format it
    var updated = updateData(userAnswer);                               // then search database for corresponding question and update answerUser
    
    if (updated === true) {
        console.log("database update succeeded, user answer recorded");
    }
    else {
        console.log("user answer not recorded :/ ")
    }
    console.dir(problems);
}

function setName() {
    student.name = document.querySelector('#InputName').value;
}

function setEmail() {
    student.email = document.querySelector('#InputEmail').value;
}

function setDate() {
    student.date = document.querySelector('#InputDate').value;
}

function setTerms() {
    student.acceptTerms = document.querySelector('#InputCheckbox').checked;
}


function verifyStudentInfo() {
    if (student.name === "") {
        return alert("Whoops, looks like you forgot to enter your name!");
    }
    else if (student.email === "") {
        return alert("Whoops, looks like you forgot to enter your email address!");
    }
    else if (student.date === "") {
        return alert("Whoops, looks like you forgot to enter today's date!");
    }
    else if (student.acceptTerms === false) {
        return alert("Check the box below to certify that the above answers are your own work.");
    }
    else {
        student.submitted = true;
        return;
    }
}



function verifyStudentAnswers() {
    var noAnswer = "";
    var numComplete = 0;
    var numTotal = problems.length;
    console.log("num complete = " + numComplete);
    console.log("num total = " + numTotal);
    
    for (question of problems) {
        if (question.answerUser.length === 0) {
            noAnswer += (question.number + " ");
            console.log(question.number + " not answered");
        }
        else {
            numComplete += 1;
            console.log(question.number + " answered");
        }
    }                                                                       // calculate test completion percentage and round to 2 decimal places
    student.completion = String((numComplete / numTotal * 100).toFixed(2) + "%");   
    
    if (numComplete < numTotal) {
        return alert("You've only completed " + student.completion + " of the problems. You have not answered question(s) : " + noAnswer + ".");
    }
    return;
}


function submitResponses(event) {
    verifyStudentInfo();                                                    // check student info (name, email, date, terms) before submitting
    verifyStudentAnswers();                                                 // check student answer completion percentage before submitting
    
    if (student.submitted === false || student.completion !== "100.00%") { 
        return;                                                             // return without submitting student's responses
    }
    else {
        event.preventDefault();
        displayAnswers();
        // emailResponses()
    }
}