// Variables
const shoppingCart = document.querySelector('#carrito');
const containerCar = document.querySelector('#lista-carrito tbody');
const emptyCarBtn= document.querySelector('#vaciar-carrito');
const courseList = document.querySelector('#lista-cursos');
let articlesCar = [];

loadEventListeners();

function loadEventListeners() {
    // Add a course by pressing "Agregar al carrito"
    courseList.addEventListener('click', addCourse);

    // Remove courses from cart
    shoppingCart.addEventListener('click', deleteCourse);

    // Show courses of localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articlesCar = JSON.parse(localStorage.getItem('shoppingCar') || []);
        shoppingCartHTML();
    })

    // Empty cart
    emptyCarBtn.addEventListener('click', () => {
        // console.log('Vaciando carrito'); Debugger
        articlesCar = []; // Reset array
        cleanHTML(); // Delete HTML of cart
    });
}

// Functions
function addCourse(e){
    // Prevents the default behavior when clicking, in this case the scroll is placed at top: 0
    e.preventDefault();

    // Verify that the element pressed has the class "agregar-carrito"
    if(e.target.classList.contains('agregar-carrito')){
        // Traversing to the main parent in this case, Card
        const selectedCourse = e.target.parentElement.parentElement;
        readDataCourse(selectedCourse);
    }
}

// Delete a course from the cart
function deleteCourse(e) {
    // console.log(e.target.classList); Debugger
    if(e.target.classList.contains('borrar-curso')){
        const courseId = e.target.getAttribute('data-id');

        // Delete array of articlesCar by data-id
        articlesCar = articlesCar.filter( course => course.id !== courseId );
        // console.log(articlesCar); Debugger
        shoppingCartHTML(); // Itterate the cart and show your HTML
    }
}

// Read the content of HTML and extract the info of course
function readDataCourse(course) {
    // console.log(course); Debugger
    // Create object with the content of current course
    const infoCourse = {
        image: course.querySelector('img').src,
        title: course.querySelector('h4').textContent,
        price: course.querySelector('.precio span').textContent,
        id: course.querySelector('a').getAttribute('data-id'),
        quantity: 1
    }

    // Check if a course already exists in the cart
    const exist = articlesCar.some( course => course.id === infoCourse.id );
    if(exist){
        // Update the quantity
        const courses = articlesCar.map( course => {
            if( course.id === infoCourse.id ){
                course.quantity++;
                return course; // Returns the updated object
            } else {
                return course; // Returns objects that are not duplicated
            }
        });
        articlesCar = [...courses];
    } else {
        // Add the course to the cart 
        articlesCar = [...articlesCar, infoCourse];
        
    }

    // console.log(infoCourse); Debugger
    console.log(articlesCar);

    shoppingCartHTML();
}

// Show the shopping cart in the HTML
function shoppingCartHTML() {

    // Clean HTML
    cleanHTML();

    // Go through the cart and generate HTML
    articlesCar.forEach( course => {

        const {image, title, price, quantity, id} = course;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${image}" width="100"/></td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // Add the HTML of cart in the label <tbody>
        containerCar.appendChild(row);
    });   

    // Add shopping Car to Storage
    syncStorage();
}

function syncStorage(){
    localStorage.setItem('shoppingCar', JSON.stringify(articlesCar));
}

// Delete the courses of label <tbody> 
function cleanHTML() {
    // One way to clean up the HTML
    // containerCar.innerHTML = '';

    // Better performance to clean HTML
    while(containerCar.firstChild) {
        containerCar.removeChild(containerCar.firstChild);
    }
}
