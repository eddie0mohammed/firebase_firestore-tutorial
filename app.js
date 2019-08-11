const cafeList = document.querySelector('#cafe-list');
const cafeForm = document.querySelector('#add-cafe-form');



//create element and render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();


    })
}

//getting data
db.collection('cafes').where('city', '==', 'manchester').orderBy('name').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    })
})

//saving data
cafeForm.addEventListener('submit', function(e){
    e.preventDefault();
    db.collection('cafes').add({
        name: cafeForm.name.value,
        city: cafeForm.city.value
    })
    cafeForm.name.value = '';
    cafeForm.city.value = '';

})

//real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(elem => {
        if (elem.type === 'added'){
            renderCafe(elem.doc);
        }else if (elem.type === 'removed'){
            let li = cafeList.querySelector(`[data-id=${elem.doc.id}]`);
            cafeList.removeChild(li);
        }
    })
})

//updating data
// db.collection('cafes').doc(`${id}`).update({
//     city: 'new york'
// })
// db.collection('cafes').doc(`${id}`).set({
//     city: 'new york'
// })


// //Note; 
// .update => updates the field specified only
// .set => replace the whole document with the new values passed
