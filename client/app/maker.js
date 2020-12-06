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

    document.querySelector("#recipeForm").reset();

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
            <input id="nameField" type="text" name="name" className="formItem"/>

            <label htmlFor="serves" className="formTxt">Serves: </label>
            <input id="servesField" type="number" name="serves" min="0" max="100" step="1" className="formItem"/>

            <label htmlFor="ingredients" className="formTxt">Ingredients: </label>
            <textarea id="ingredientField" name="ingredients" rows='15' col='50' className="formItem"></textarea>

            <label htmlFor="instructions" className="formTxt">Instructions: </label>
            <textarea id="instructionField" name="instruction" rows='15' col='50' className="formItem"></textarea>

            <input type='hidden' name='_csrf' value={props.csrf} />
            <input type="submit" value="Make Recipe" className="formButton"/>

        </form>
        </div>
    );
}

const RecipeList = function(props){

    

    if(props.recipes.length === 0){
        return(
            <div className="recipeContenthor">
                <h3 className="emptyRecipe" >You haven't uploaded any recipies.</h3>
            </div>
        );
    }


     


    let recipeHolder = []; //holds 3 recipes to let them all be added at once
    let recipeNodes = []; // Holds all recipes
    let numElAdded = 0;
    //recipeNodes.push(<section class="recipeContenthor" ></section>);

    props.recipes.forEach(recipe => {
        recipeHolder.push(
            <div key={recipe._id} className="recipe">
                <button className="RecipeBox">
                    <h4>{recipe.name}</h4>
                    <p><b>Serves:</b>{recipe.serves}</p>
                    <hr />
                    <p><b>Ingredients</b></p>
                    <p>{recipe.ingredients}</p>
                    <hr />
                    <p><b>Instructions</b></p>
                    <p>{recipe.instructions}</p>
                </button>
            </div>
        );
    
        numElAdded++;

        if(numElAdded%3 ===0 || props.recipes.length === numElAdded){
            recipeNodes.push(<section key={recipe._id} className="recipeContenthor" > {recipeHolder} </section>); // push up to 3 recipes into one row
            recipeHolder = [];//clear recipeholder
        }

    });

    
    return (
    <div className="recipeList">
        <h3>Your Recipes</h3>
        {recipeNodes}
    </div>
    );
};

const loadRecipesFromServer =()=> {
    sendAjax('GET', '/getRecipes', null, (data) =>{
        //console.log(data.recipes);
        ReactDOM.render(
        <RecipeList recipes={data.recipes} />, document.querySelector('#recipeContentvert')
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
