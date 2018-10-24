const categoryList = "https://opentdb.com/api_category.php";
const questionAmount = "https://opentdb.com/api_count.php?category=${categoryId}";
const $categorySelect =  $("#category-select");
const $slideText = $("#slide-value");
const $questionRange = $("#question-range");

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
            $slideText.text("1");
            $questionRange.val("1");
        }
        else
        {
            $questionRange.attr("max", response.category_question_count.total_easy_question_count);
            $slideText.text("1");
            $questionRange.val("1");
        }
    }
    else if(difficulty === "medium")
    {
        if(response.category_question_count.total_medium_question_count > 50)
        {
            $questionRange.attr("max", 50);
            $slideText.text("1");
            $questionRange.val("1");
        }
        else
        {
            $questionRange.attr("max", response.category_question_count.total_medium_question_count);
            $slideText.text("1");
            $questionRange.val("1");
        }
    }
    else if(difficulty === "hard")
    {
        if(response.category_question_count.total_hard_question_count > 50)
        {
            $questionRange.attr("max", 50);
            $slideText.text("1");
            $questionRange.val("1");
        }
        else
        {
            console.log(response.category_question_count.total_hard_question_count);
            $questionRange.attr("max", response.category_question_count.total_hard_question_count);
            $slideText.text("1");
            $questionRange.val("1");
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

function startTrivia(response)
{
    if(response.response_code === 1)
    {
        console.log("Not enough questions! Please select less or a different category");
    }
    console.log(response);
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