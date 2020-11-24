const handleRecipe =(e)=>{
    e.preventDefault();

    $("#recipeMessage").animate({height:'hide'}, 350);

    if($("#nameField").val() == '' || $("#servesField").val() == ''|| $("#ingredientField").val() == ''|| $("#instructionField").val() == ''){
        handleError("Please fill in all fields.");
        console.log("err: not all data present");
        return false;
    }

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function(){
        loadRecipesFromServer();
    });

    return false;
}

const RecipeForm = (props) =>{
    return(
        <div>
        <h3>Have a Recipe? Submit it!</h3>
        
        <form id="recipeForm"
        onSubmit={handleRecipe}
        name="recipeForm"
        action="/maker"
        method="POST"
        className="recipeForm"
        >
            <label htmlFor="name" className="formTxt">Recipe Name: </label>
            <input id="nameField" type="text" name="name" className="formItem" placeholder="Recipe Name"/>

            <label htmlFor="serves" className="formTxt">Serves: </label>
            <input id="servesField" type="number" name="serves" min="0" max="100" step="1" className="formItem" />

            <label htmlFor="ingredients" className="formTxt">Ingredients: </label>
            <textarea id="ingredientField" name="ingredients" rows='15' col='50' className="formItem"></textarea>

            <label htmlFor="instructions" className="formTxt">Instructions: </label>
            <textarea id="instructionField" name="instruction" rows='15' col='50' className="formItem"></textarea>

            <input type='hidden' name='_csrf' value={props.csrf} />
            <input type="submit" value="Make Recipe" className="formItem"/>

        </form>
        </div>
    );
}

const RecipeList = function(props){

    if(props.recipes.length === 0){
        return(
            <div className="recipeList">
                <h3 className="emptyRecipe" >No Recipes yet</h3>
            </div>
        );
    }

    const recipeNodes = props.recipes.map(function(recipe){
        return(
            <div key={recipe._id} className="recipe">
                <h3>Name: {recipe.name} </h3>
                <h3>Serves: {recipe.serves} </h3>
                <h3>Ingredients: {recipe.ingredients} </h3>
                <h3>Instructions: {recipe.instructions} </h3>
            </div>
        );
    });

    return (
    <div className="recipeList">
        {recipeNodes}
    </div>
    );
};

const loadRecipesFromServer =()=> {
    sendAjax('GET', '/getRecipes', null, (data) =>{
        //console.log(data.recipes);
        ReactDOM.render(
        <RecipeList recipes={data.recipes} />, document.querySelector('#recipes')
        );
    });
}

const setup = function(csrf){
    ReactDOM.render(
        <RecipeForm csrf={csrf} />, document.querySelector('#makeRecipe')
    );

    loadRecipesFromServer();
}

const getToken =() =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
}


$(document).ready(function() {
    getToken();
});
