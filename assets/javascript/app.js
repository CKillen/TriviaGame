const categoryList = "https://opentdb.com/api_category.php";
const questionAmount = "https://opentdb.com/api_count.php?category=${categoryId}";
const $categorySelect =  $("#category-select");
const $slideText = $("#slide-value");
const $questionRange = $("#question-range");

let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let unanswered = 0;

let testI;

grabInformationForScreenRender();
$questionRange.hide();
$slideText.hide();

$questionRange.on("input", function(){
    $slideText.text(this.value);
})

function renderScreen(response)
{
    response.trivia_categories.forEach(element =>{

        let $option = $("<option>").text(element.name).val(element.id);
        $categorySelect.append($option);

    })

    $categorySelect.on("change" , function() {

        let questionURL = questionAmount.replace("${categoryId}", this.value);

        $.ajax({
            url: questionURL,
            method: "GET",
        }).done(renderScreen2); 
    })

    $('input[type=radio][name=difficulty]').on("change", function() {
        let questionURL = questionAmount.replace("${categoryId}", $categorySelect.val());

        $.ajax({
            url: questionURL,
            method: "GET",
        }).done(renderScreen2);        
    })

}

function renderScreen2(response)
{
    let difficulty = $('input[type=radio][name=difficulty]:checked').val();
    if(difficulty === "easy")
    {
        if(response.category_question_count.total_easy_question_count > 50)
        {
            $questionRange.attr("max", 50);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
        else
        {
            $questionRange.attr("max", response.category_question_count.total_easy_question_count);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
    }
    else if(difficulty === "medium")
    {
        if(response.category_question_count.total_medium_question_count > 50)
        {
            $questionRange.attr("max", 50);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
        else
        {
            $questionRange.attr("max", response.category_question_count.total_medium_question_count);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
    }
    else if(difficulty === "hard")
    {
        if(response.category_question_count.total_hard_question_count > 50)
        {
            $questionRange.attr("max", 50);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
        else
        {
            $questionRange.attr("max", response.category_question_count.total_hard_question_count);
            $slideText.text("5");
            $questionRange.val("5");
            $questionRange.off().on("input", function(){
                $slideText.text(this.value);
            })
        }
    }
    
    $questionRange.show();
    $slideText.show();
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
    }).done(renderScreen); 
}



function makeButtons(answer, value)
{
    $answerButton = $("<button>").text(answer).val(value).addClass("answer-button");
    
    return $answerButton;
}

function displayNextAnsweredPage(correct, questionObject)
{
    $(".main-container").empty();
    if(correct === true)
    {
        clearInterval(testI);
        $(".main-container").append($("<h1>").text("Good job! You are correct!"));
        //dispaly correct answer
        //display score
        //button for next question
    }
    else
    {
        clearInterval(testI);
        $(".main-container").append($("<h1>").text("Better Luck next time!"));        
        //dispaly correct answer
        //display score
        //button for next question
    }
    $(".main-container").append($("<h1>").text("Correct Answer: " + questionObject[currentQuestion].correct));

    $(".main-container").append($("<h1>").text("Correct Answers :" + correctAnswers));
    $(".main-container").append($("<h1>").text("Wrong Answers : " + wrongAnswers));
    $(".main-container").append($("<h1>").text("Unanswered Answers : " + unanswered));
    
    $(".main-container").append($("<button>").text("Next question").on("click", function(){
        currentQuestion++;
        displayNextQuestion(questionObject);
    }))

}

function displayNextQuestion(questionObject)
{
    count = 5;
    if(testI)
    {
        //reclear 
        clearInterval(testI);
    }
    testI = setInterval(test, 1000, questionObject);

    $(".main-container").empty();
    
    $(".main-container").append($("<h1>").html(questionObject[currentQuestion].question))
    $(".main-container").append($("<h1>").addClass("timer").text("5"));

    for(let i = 0; i < questionObject[currentQuestion].answers.length; i++)
    {
        $(".main-container").append(questionObject[currentQuestion].answers[i]);
    }



    $(".main-container").append($("<h1>").text("Correct Answers :" + correctAnswers));
    $(".main-container").append($("<h1>").text("Wrong Answers : " + wrongAnswers));
    $(".main-container").append($("<h1>").text("Unanswered Answers : " + unanswered));


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


        

        console.log(this.value);

    })
}


function startTrivia(response)
{

    questions = response.results;
    
    questionObject = createQuestionObject(response.results);

    displayNextQuestion(questionObject);



    //---next make buttons with answers
    //---then push them to a page
    //---make onclick events for said buttons
    //--Set timer
    //--display question
    //--countdown timer until button is pressed
    //--stop timer
    //////////////////dispaly right/wrong page
    //--increment correct/inccorect/unanswered counters
    //--reset timer
    /////////////////start over


}

function test(questionObject)
{
    count--;
    $(".timer").text(count);
    if(count === 0)
    {
        unanswered++;
        displayNextAnsweredPage(false, questionObject);
    }
    console.log(count);
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
