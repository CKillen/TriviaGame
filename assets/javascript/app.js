//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Variables
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

//API
const categoryList = "https://opentdb.com/api_category.php";
const questionAmount = "https://opentdb.com/api_count.php?category=${categoryId}";

//Jquery - these are lets because they change on reset
let $categorySelect;
let $slideText;
let $questionRange;
//const because it never changes
const $mainContainer = $(".main-container");

//HTML
const startPageHtml = $mainContainer.html();

//Scores
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let unanswered = 0;

//Interval
let intervalId;

//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Start Game
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

startScreen();

//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Style Right/Wrong and End
//  REFACTOR!!!!!
//
//////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Functions
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

function renderCategories(response)
{
    //populate the categories select
    response.trivia_categories.forEach(element =>{

        let $option = $("<option>").text(element.name).val(element.id);
        $categorySelect.append($option);

    })

    addSliderListeners();

}

function addSliderListeners()
{
        //Render slider on category changes
        $categorySelect.on("change" , function() {
            let questionURL = questionAmount.replace("${categoryId}", this.value);
    
            $.ajax({
                url: questionURL,
                method: "GET",
            }).done(renderSlider); 
        });
    
        //Render slider when difficulty changes
        $('input[type=radio][name=difficulty]').on("change", function() {
            let questionURL = questionAmount.replace("${categoryId}", $categorySelect.val());
    
            $.ajax({
                url: questionURL,
                method: "GET",
            }).done(renderSlider);        
        });
}

function renderSlider(response)
{
    let difficulty = $('input[type=radio][name=difficulty]:checked').val();

    if(difficulty === "easy")
    {
        if(response.category_question_count.total_easy_question_count > 50)
        {
            slideValues(50);
        }
        else
        {
            slideValues(response.category_question_count.total_easy_question_count);
        }
    }
    else if(difficulty === "medium")
    {
        if(response.category_question_count.total_medium_question_count > 50)
        {
            slideValues(50);

        }
        else
        {
            slideValues(response.category_question_count.total_medium_question_count);

        }
    }
    else if(difficulty === "hard")
    {
        if(response.category_question_count.total_hard_question_count > 50)
        {
            slideValues(50);
        }
        else
        {
            slideValues(response.category_question_count.total_hard_question_count);
        }
    }
    
    $questionRange.show();
    $slideText.show();

    startGameButtonEvent();

}

function slideValues(value)
{
    $questionRange.attr("max", value);
    $slideText.text("5");
    $questionRange.val("5");
    //event for slide text
    $questionRange.off().on("input", function(){
        $slideText.text(this.value);
    })
}

function startGameButtonEvent()
{
    $("#start-game-button").off().on("click", function(){
        let amount = $questionRange.val();
        let category = $categorySelect.val();
        let difficulty = $('input[name=difficulty]:checked').val();

        doAjax(createURL(amount, category, difficulty));
    })
}

function createURL(amount, category, difficulty)
{
    const fullURL = "https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}";

    let newURL = fullURL.replace("${amount}", amount).replace("${category}", category).replace("${difficulty}", difficulty);

    return newURL;
}

function doAjax(APIurl)
{
    $.ajax({
        url: APIurl,
        method: "GET",
    }).done(startTrivia);
}

function grabInformationForScreenRender()
{
    $.ajax({
        url: categoryList,
        method: "GET",
    }).done(renderCategories)

}

function makeButtons(answer, value)
{
    $answerButton = $("<button>").text(answer).val(value);
    
    return $answerButton;
}

function displayNextAnsweredPage(correct, questionObject)
{
    $mainContainer.empty();
    if(correct === true)
    {
        clearInterval(intervalId);
        $mainContainer.append($("<h1>").text("Good job! You are correct!"));
    }
    else
    {
        clearInterval(intervalId);
        $mainContainer.append($("<h1>").text("Better Luck next time!"));        

    }

    $mainContainer.append($("<h1>").text("Correct Answer: " + questionObject[currentQuestion].correct));



    if(Object.keys(questionObject).length - 1 === currentQuestion)
    {
        //End Game

        $mainContainer.append($("<h1>").text("Trivia Quiz Finished!"));
        $mainContainer.append($("<button>").text("RESET").on("click", function(){
            startScreen();
        }))

    }
    else
    {

        //Next Question

        $mainContainer.append($("<button>").text("Next question").on("click", function(){
            currentQuestion++;
            displayNextQuestion(questionObject);
        }))
    }

    $mainContainer.append($("<h1>").text("Correct Answers :" + correctAnswers));
    $mainContainer.append($("<h1>").text("Wrong Answers : " + wrongAnswers));
    $mainContainer.append($("<h1>").text("Unanswered Answers : " + unanswered));
    


}

function displayNextQuestion(questionObject)
{
    count = 15;
    if(intervalId)
    {
        //reclear 
        clearInterval(intervalId);
    }
    intervalId = setInterval(countDown, 1000, questionObject);

    $mainContainer.empty();
    
    $mainContainer.append($("<h1>").html(questionObject[currentQuestion].question))
    $mainContainer.append($("<h1>").addClass("timer").text("5"));

    for(let i = 0; i < questionObject[currentQuestion].answers.length; i++)
    {
        $mainContainer.append(questionObject[currentQuestion].answers[i]);
    }



    $("button").on("click", function()
    {
        if(this.value === "true")
        {
            correctAnswers++;
            displayNextAnsweredPage(true, questionObject);
        }
        else
        {
            wrongAnswers++;
            displayNextAnsweredPage(false, questionObject);
        }

    })
}


function startTrivia(response)
{

    questions = response.results;
    
    questionObject = createQuestionObject(response.results);

    displayNextQuestion(questionObject);
}

function countDown(questionObject)
{
    count--;
    $(".timer").text(count);
    if(count === 0)
    {
        unanswered++;
        displayNextAnsweredPage(false, questionObject);
    }

}

function createQuestionObject(questions)
{
    let questionObject = {};
    
    for(let i = 0; i < questions.length; i++)
    {
        questionObject[i] = {};
        questionObject[i].answers = [];
        questionObject[i].correct = questions[i].correct_answer;

        if(questions[i].type === "multiple")
        {

            correctPosition = Math.floor(Math.random() * (questions[i].incorrect_answers.length + 1));

            questionObject[i].question = questions[i].question;
            for(let j = 0; j < questions[i].incorrect_answers.length; j++)
            {
                if(j === correctPosition)
                {
                    questionObject[i].answers.push(makeButtons(questions[i].correct_answer, true));
                }
                
                questionObject[i].answers.push(makeButtons(questions[i].incorrect_answers[j], false));

                if(j === questions[i].incorrect_answers.length - 1 && correctPosition === questions[i].incorrect_answers.length)
                {
                    questionObject[i].answers.push(makeButtons(questions[i].correct_answer, true));
                }
            }
        }
        else if(questions[i].type === "boolean")
        {
            questionObject[i].question = questions[i].question;
            questionObject[i].correct = questions[i].correct_answer;

            if(questions[i].correct_answer === "True")
            {
                questionObject[i].answers.push(makeButtons("True", true));
                questionObject[i].answers.push(makeButtons("False", false));
            }
            else
            {
                questionObject[i].answers.push(makeButtons("True", false));
                questionObject[i].answers.push(makeButtons("False", true));
            }
        }
    }

    return questionObject;
}

function startScreen()
{
    $mainContainer.html(startPageHtml);

    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    unanswered = 0;
    
    $categorySelect =  $("#category-select");
    $slideText = $("#slide-value");
    $questionRange = $("#question-range");

    grabInformationForScreenRender();
    $questionRange.hide();
    $slideText.hide();
    
    $questionRange.on("input", function(){
        $slideText.text(this.value);
    })
}
