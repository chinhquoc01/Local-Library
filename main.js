// let library = []
let storage = window.localStorage

class Book{
    constructor(
        id = '0', 
        title = 'unknown', 
        author = 'unknown', 
        page = '0', 
        read = false)
        {
        this.title = title
        this.author = author
        this.page = page
        this.read = read
        this.id = id
    }

}

class Library{
    constructor(){
        this.books = []
    }
    addBook(book){
        let temp = this.books.filter(b => b.id == book.id)
        // console.log(temp);
        if(temp.length == 0) {
            this.books.push(book)
            Toastify({
                text: "Thêm sách thành công!",
                position: "center", 
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }
        else {
            Toastify({
                text: "Trùng id, không thêm được",
                position: "center", 
                style: {
                  background: "linear-gradient(to right, #FFE000, #799F0C)",
                }
              }).showToast();
              
        }
    }
    
    removeBook(id){
        // library.pop(book)
        this.books = this.books.filter(book => book.id != id)
        Toastify({
            text: "Xoá sách thành công!",
            position: "center", 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
    
    updateBook(oldBook, newBook){
        let idOld = this.books.findIndex(b => b.id == oldBook.id)
        this.books[idOld].title = newBook.title
        this.books[idOld].author = newBook.author
        this.books[idOld].page = newBook.page
        this.books[idOld].read = newBook.read
        Toastify({
            text: "Cập nhật sách thành công!",
            position: "center", 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }

    getBook(id){
        return this.books.find(book => book.id == id)
    }
    isInLibrary(id){
        return this.books.some(book => book.id == id)
    }
}

const library = new Library()


const addBtn = document.querySelector('#add')
const updateBtn = document.querySelectorAll('.update')
let removeBtns = document.querySelectorAll('.remove')
const submit = document.querySelector('#submit')
const update = document.querySelector('#update')

const booksList = document.querySelector('.books')
const form = document.querySelector('.form')
const update_form = document.querySelector('.update_form')
const body = document.querySelector('body')

let titleForm = form.querySelector('input[name="title"]')
let authorForm = form.querySelector('input[name="author"]')
let pageForm = form.querySelector('input[name="page"]')
let idForm = form.querySelector('input[name="id"]')
let readForm = form.querySelector('input[id="read"]')

let titleUpdate = update_form.querySelector('input[name="title"]')
let authorUpdate = update_form.querySelector('input[name="author"]')
let pageUpdate = update_form.querySelector('input[name="page"]')
let idUpdate = update_form.querySelector('input[name="id"]')
let readUpdate = update_form.querySelector('input[id="read"]')
// console.log(title);
// console.log(addBtn);
function blurBackground(){
    body.classList.add('blur')
}

function showBook(){
    booksList.innerHTML = '';
    library.books.forEach(book => {
        booksList.innerHTML += `<div class="card">
                    <div class="img"><img src="img/Daco_1000939.png" alt=""></div>
                    <div class="title"><h2>${book.title}</h2></div>
                    <div class="author"><h3>${book.author}</h3></div>
                    <div class="page">${book.page} pages</div>
                    <div class="more">
                        <div class="info">
                            <span>ID: ${book.id}</span>
                            <span class="read">Read: <input type="checkbox" name="read" id=""`+ (book.read ? "checked" : '') + `></span>
                        </div>
                        <div class="button">
                            <button class="update" id="${book.id}_update" onclick="clickUpdateBtn(this.id)">Update</button>
                            <button class="remove" id="${book.id}_remove" onclick="clickRemoveBtn(this.id)">Remove</button>
                        </div>
                    </div>
                </div>`
    })
    removeBtns = document.querySelectorAll('.remove')
    console.log(removeBtns);

}
addBtn.addEventListener("click", ()=>{
    // console.log('click add btn ay');
    form.classList.toggle('hide')
})

submit.addEventListener('click', ()=>{
    if(idForm.value == '' || titleForm.value == '' || authorForm.value == ''){
        Toastify({
            text: "Vui lòng điền tên sách, tác giả và id sách!",
            position: "center", 
            style: {
              background: "linear-gradient(to right, #FFE000, #799F0C)",
            }
        }).showToast();
    }
    else {
        let book = new Book(idForm.value, titleForm.value, authorForm.value, pageForm.value, readForm.checked)
        library.addBook(book)
        console.log(book);
        console.log(library);
        form.classList.add('hide')
        saveLocal()
        loadLocal()
        showBook()
    }
})

function clickRemoveBtn(id){
    // console.log(id);
    let idbook = id.substring(0, id.length-7)
    console.log(idbook);
    library.removeBook(idbook)
    saveLocal()
    loadLocal()
    showBook()
}

function clickUpdateBtn(id){
    let idbook = id.substring(0, id.length-7)
    // form.classList.remove('hide')
    openFormForUpdate(idbook)
    // form.classList.add('hide')

}
function closeForm(){
    form.classList.toggle('hide')
}
function closeUpdate(){
    update_form.classList.toggle('hide')
}
function openFormForUpdate(id){
    let book = library.getBook(id)
    titleUpdate.value = book.title
    authorUpdate.value = book.author
    pageUpdate.value = book.page
    idUpdate.value = book.id
    readUpdate.checked = book.read
    update_form.classList.remove('hide')
}
update.addEventListener('click', ()=>{
    let book = library.getBook(idUpdate.value)
    let newbook = new Book(idUpdate.value, titleUpdate.value, authorUpdate.value, pageUpdate.value, readUpdate.checked)
    library.updateBook(book, newbook)
    saveLocal()
    loadLocal()
    showBook()
    closeUpdate()
})

loadLocal()
showBook()

function saveLocal(){
    storage.setItem('lib', JSON.stringify(library.books))
}

function loadLocal(){
    const books = JSON.parse(storage.getItem('lib'))
    if(books) {
        library.books = books.map(book => JSONtoBook(book))
    }
}

function JSONtoBook(book){
    return new Book(book.id, book.title, book.author, book.page, book.read)
}


