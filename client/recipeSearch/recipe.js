const handleSearch = (e) => {
    e.preventDefault();

    //$("#recipeMessage").animate({ height: 'hide' }, 350);

    //console.log('here');

    if ($("#searchField").val() == '') {
        // get all recipes if search bar is empty
        loadRecipesFromServer();

        return false;
    }


    // get all the recipes when the page loads
    sendAjax('GET', '/bySearch', $("#searchForm").serialize(), (data) => {
        //console.log(data.recipes);
        ReactDOM.render(
            <RecipeList recipes={data.recipes} />, document.querySelector('#recipeContentvert')
        );
    });

    document.querySelector("#searchForm").reset();

    return false;

}

const SearchForm = (props) =>{
    return(
        <div className="searchBar">
        <form id="searchForm"
        onSubmit={handleSearch}
        name="searchForm"
        action="/allRecipes"
        method="GET"
        className="searchForm"
        >
            <input id="searchField" type="text" name="search" className="formItem"/>

            <input type='hidden' name='_csrf' value={props.csrf} />
            <input type="submit" value="Search" className="formButton"/>

        </form>
        </div>
    );
}

const RecipeList = function(props){

    

    if(props.recipes.length === 0){
        return(
            <div className="recipeContenthor">
                <h3 className="emptyRecipe" >No Recipes</h3>
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
                    <div>
                    <h4>{recipe.name}</h4>
                    <p><b>Serves:</b>{recipe.serves}</p>
                    <hr />
                    <p><b>Ingredients</b></p>
                    <p>{recipe.ingredients}</p>
                    <hr />
                    <p><b>Instructions</b></p>
                    <p>{recipe.instructions}</p>
                    </div>
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
        {recipeNodes}
    </div>
    );
};

const loadRecipesFromServer =()=> {
    // get all the recipes when the page loads
    sendAjax('GET', '/allRecipes', null, (data) =>{
        //console.log(data.recipes);
        ReactDOM.render(
        <RecipeList recipes={data.recipes} />, document.querySelector('#recipeContentvert')
        );
    });
}

const setup = function(csrf){
    // gets called when the page is set up
    ReactDOM.render(
        <SearchForm csrf={csrf} />, document.querySelector('#search')
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
