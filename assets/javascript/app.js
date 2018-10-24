
let amount = 5;
let category = 9;
let difficulty = "easy";

const categoryList = "https://opentdb.com/api_category.php";
const $categorySelect =  $("#category-select");
grabInformationForScreenRender();




function renderScreen(response)
{
    response.trivia_categories.forEach(element =>{

        let $option = $("<option>").text(element.name).val(element.id);
        $categorySelect.append($option);

    })

    //add event listener to select

    $categorySelect.on('change', function(){
        console.log(this.value);
    });

    //add event listener to category

    //add event listener to difficulty
    console.log(response.trivia_categories);
}

function startTrivia(response)
{
    console.log(response);
}

function createURL(amount, category, difficulty)
{
    const fullURL = "https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple";

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