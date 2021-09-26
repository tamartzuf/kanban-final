//create task element with user input
function createTaskElement(taskInput){
    let newTask = document.createElement("li")
    newTask.classList.add("task")
    newTask.innerText = taskInput
    newTask.addEventListener("mouseover", handleMouseOver)
    newTask.addEventListener("dblclick",editTask)
    return newTask
}

//add new task to the relevant section
function addButtonClick(){
    const taskInput = this.parentNode.querySelector("input").value
    if (taskInput && taskInput.trim()){
        const sectionCategory = event.currentTarget.parentNode.id
        const list = this.parentNode.querySelector("ul")
        const task = createTaskElement(taskInput)
        list.prepend(task)
        saveToLocalStorage(taskInput, sectionCategory)
        this.parentElement.querySelector("input").value = ""
    }
    else{
        alert("You can't add an empty task")
    }
}

//Builds an empty object of tasks to LocalStorage
function buildLocalStorage(){
    if(!localStorage.getItem("tasks")){
        const tasks = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        localStorage.setItem("tasks",JSON.stringify(tasks))
    }
}

//Saves tasks from DOM to LocalStorage
function saveToLocalStorage(taskInput, category) {
    const myLocalStorage = JSON.parse(localStorage.getItem("tasks"))

    //Match for the appropriate category
    const appropriateTasksList = myLocalStorage[category]

    appropriateTasksList.unshift(taskInput)
    myLocalStorage[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(myLocalStorage)) //adds the new task to the local storage 
}

//Removes the task from the previous category from the local storage
function removeFromLocalStorage(taskInput, category) {
    const myLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = myLocalStorage[category]
    appropriateTasksList.splice(appropriateTasksList.indexOf(taskInput),1)
    myLocalStorage[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(myLocalStorage))
    
}

//Build task elements from tasks saved to LocalStorage
function localStorageTasksToDom(){
    const tasks = JSON.parse(localStorage.getItem("tasks"))
    for(let [category, tasksList] of Object.entries(tasks)){ //returns an array of a given object's own enumerable string-keyed property
        let categoryElement = document.querySelector(`#${category}`).querySelector("ul")
        for (let task of tasksList){
            categoryElement.appendChild(createTaskElement(task))
        }       
    }
}

//Search for tasks according to the value of the search input
const searchInput = document.getElementById('search')
//A function is triggered when the user releases a key in the input field.
searchInput.onkeyup = function searchFilter () {
    let filter = searchInput.value.toLowerCase().split()
    let liElements = document.getElementsByTagName('li')
    for (var i = 0; i < liElements.length; i++) {
        var li = liElements[i].innerHTML;        
        if (li.toLowerCase().includes(filter)) {
            liElements[i].style.display = 'list-item' //Element is rendered as a list
        }
        else{
            liElements[i].style.display = 'none' //Element will not be displayed
        }
    }
}

//Return the position in LocalStorage of a given task
function IndexInLocalStorage(task, category){
    const myLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    const taskIndex= myLocalStorage[category].indexOf(task)
    return taskIndex   
}

//changes the task input
function changeLocalStorage(newTask, category, taskIndex){
    const myLocalStorage = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = myLocalStorage[category]
    appropriateTasksList.splice(taskIndex,1, newTask)
    
    myLocalStorage[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(myLocalStorage))
}

//Let a task be editable and replaces the existing text
function editTask() {
    this.contentEditable = true
    const category = this.parentElement.parentElement.id
    const currentIndex = IndexInLocalStorage(this.innerText, category)
    this.addEventListener("blur",() =>{
        //if edit empty removes li from local storage
        if (this.innerText == "") {
            alert("You can't insert empty input" )
        }
        else{
            changeLocalStorage(this.innerText, category, currentIndex)
            this.contentEditable = false
            console.log(localStorage)
        }
    })
    
}

//handle mouse over and move tasks by alt and numbers
function handleMouseOver(event){
    document.addEventListener("keyup",handleKeyUp)
    function handleKeyUp(e){
        const key = Number(e.key)
        if(e.altKey){
            if(key===1){
                removeFromLocalStorage(event.target.innerText,event.target.closest('section').id)  
                saveToLocalStorage(event.target.innerText,"todo")
                document.querySelector(".to-do-tasks").prepend(event.target)
            }
            else if(key===2){
                removeFromLocalStorage(event.target.innerText,event.target.closest('section').id)  
                saveToLocalStorage(event.target.innerText,"in-progress")
                document.querySelector(".in-progress-tasks").prepend(event.target) 
            }
            else if(key===3){
                removeFromLocalStorage(event.target.innerText,event.target.closest('section').id)  
                saveToLocalStorage(event.target.innerText,"done")
                document.querySelector(".done-tasks").prepend(event.target)
            }
        }
    }
    document.addEventListener("mouseout",handleMouseOut)
        function handleMouseOut(){
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('keyup', handleKeyUp);
        }
}


//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)


//On load functions
buildLocalStorage()
localStorageTasksToDom()