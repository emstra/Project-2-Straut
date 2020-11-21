const handleDomo =(e)=>{
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });

    return false;
}



const UserList = function(props){

    if(props.users.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo" >No Users yet</h3>
            </div>
        );
    }

    const userNodes = props.users.map(function(user){
        return(
            <div key={user.userid} className="domo">
                <h3 className="domoName">Name: {user.username} </h3>
                <h3 className="domoAge">User ID: {user.userid} </h3>
            </div>
        );
    });

    return (
    <div className="domoList">
        {userNodes}
    </div>
    );
};

const loadUsersFromServer =()=> {
    sendAjax('GET', '/getUsers', null, (data) =>{
        ReactDOM.render(
        <UserList users={data.users} />, document.querySelector('#users')
        );
    });
}

const setup = function(csrf){
    ReactDOM.render(
        <UserList users={[]} />, document.querySelector('#users')
    );

    loadUsersFromServer();
}

const getToken =() =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
}


$(document).ready(function() {
    getToken();
});
