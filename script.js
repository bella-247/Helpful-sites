const searchBox = document.querySelector("#search-box");
const addSite_btn = document.querySelector(".add-site-btn");
const editors_container = document.querySelector(".editors-container");
const site_adder = document.querySelector(".editors.site-adder");
const site_modifier = document.querySelector(".editors.site-modifier");
const sites_list_container = document.querySelector(".sites-list-container");
let sites_list = []

const addBtn = site_adder.querySelector("#add-btn");
const saveBtn = site_modifier.querySelector("#save-btn")
const deleteBtn = site_modifier.querySelector("#delete-btn")

let isSiteAdderOpen = false, isSiteModifierOpen = false;
let handleOutsideClicks, handleSave, handleDelete, handleAdd; // event handling variables
let count_sites = Number(localStorage.getItem('count-sites')) || 1;


retrieveStorage();



function start_editing(link){
    const address = link.href;
    const name = link.textContent;
    const nameBox = site_modifier.querySelector("#modify-site-name")
    const addressBox = site_modifier.querySelector("#modify-site-address")
    nameBox.value = name;
    addressBox.value = address;
    site_modifier.classList.add("show");
    editors_container.classList.add("show");
    isSiteModifierOpen = true;

    handleSave = (e) =>{
        e.preventDefault();
        save_edit(link, nameBox, addressBox)
    }

    handleDelete = ()=>{
        let index = sites_list.indexOf(link.parentElement)
        let leng = sites_list.length
        if (-1 < index < leng - 1){
            sites_list = sites_list.slice(0, index).concat(sites_list.slice(index+1, leng))
        }
        else{
            sites_list.pop()
        }
        deleteList(link.parentElement);
    }
    saveBtn.addEventListener('click', handleSave);
    deleteBtn.addEventListener("click", handleDelete);
    setupOutsideClickHandler(site_modifier)
}

function save_edit(link, nameBox, addressBox){
    const index = sites_list.indexOf(link.parentElement);
    if(nameBox.value.trimStart().trimEnd() == '' || addressBox.value.trimStart().trimEnd() == "") return;
    link.textContent = nameBox.value;
    link.href = addressBox.value;
    sites_list[index] = link.parentElement;
    saveBtn.removeEventListener('click', handleSave);
    deleteBtn.removeEventListener('click', handleDelete);
    save_to_localStorage(link.parentElement.id, nameBox.value, addressBox.value);
    closeEditors();
}

function deleteList(currentList){
    sites_list_container.removeChild(currentList);
    closeEditors();
    saveBtn.removeEventListener('click', handleSave);
    deleteBtn.removeEventListener('click', handleDelete);
    localStorage.removeItem(currentList.id)

}


// the site adding btn here 
addSite_btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    if (isSiteAdderOpen) return closeEditors()
    if (isSiteModifierOpen) closeEditors();
    addSite_btn.classList.add('active');
    site_adder.classList.add("show");
    editors_container.classList.add("show");
    isSiteAdderOpen = true;

    // setting up a handling function 
    handleAdd = (e)=>{
        e.preventDefault();
        AddSite();
    }
    addBtn.addEventListener('click', handleAdd)
    setupOutsideClickHandler(site_adder);
})

function AddSite(){
    const nameBox = site_adder.querySelector("#add-site-name")
    const addressBox = site_adder.querySelector("#add-site-address")
    createList(`${count_sites}`, nameBox.value, addressBox.value, );
    nameBox.value = "";
    addressBox.value = "";
    closeEditors();
    addBtn.removeEventListener('click', handleAdd);
}

function createList(id, name, address){
    const newList = document.createElement("li");
    const newLink = document.createElement("a")
    const newEdit_btn = document.createElement('span')
    newList.classList.add("sites-list");
    newList.id = id;
    newLink.href = address;
    newLink.textContent = name;
    newLink.setAttribute('target', "_blank");
    newEdit_btn.textContent = 'Edit';
    
    newList.appendChild(newLink)
    newList.appendChild(newEdit_btn)
    sites_list_container.appendChild(newList)
    sites_list.push(newList)

    
    newEdit_btn.addEventListener("click", (e)=>{
        e.stopPropagation();
        start_editing(newLink)
    });
    save_to_localStorage(id, name, address)
    if(Number(id) >= count_sites ){
        count_sites += 1
        localStorage.setItem("count-sites", count_sites);
    }
    return newList;
}

// helping  functions
function closeEditors(){
    addSite_btn.classList.remove('active');
    site_adder.classList.remove("show");
    site_modifier.classList.remove("show");
    editors_container.classList.remove("show");
    isSiteAdderOpen = false;
    isSiteModifierOpen = false;
    document.removeEventListener("click", handleOutsideClicks);
}

function setupOutsideClickHandler(targetElem){
    // this funciton setups the outside click event listener for the editors (site_adder && site_modifier)
    handleOutsideClicks = (e)=>{
        if(targetElem && !targetElem.contains(e.target)){
            closeEditors();
        }
    }
    document.addEventListener("click", handleOutsideClicks);
}

function save_to_localStorage(id, name, address){
    localStorage.setItem(id, [name, address])
}

function retrieveStorage(){
    const leng = localStorage.length;
    for (let i = 0; i < leng; i++) {
        const id = localStorage.key(i);
        if(id == 'count-sites') {
            continue;
        }
        const [name, address] = localStorage.getItem(id).split(',');
        createList(id, name, address)
    }
}

searchBox.addEventListener("keyup", searching);
function searching(){
    sites_list.forEach(list=>{
        list.classList.remove("hide");
        const name = list.querySelector('a').textContent.trimStart().trimEnd().toLowerCase();
        const address = list.querySelector('a').href;
        const searchValue = searchBox.value.trimStart().trimEnd().toLowerCase();
        if(!name.includes(searchValue) && !address.slice(5, address.length).includes(searchValue)){
            list.classList.add("hide")
        }
    })
}





