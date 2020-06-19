const form = document.querySelector('#form-task');
const db = firebase.firestore();
const taskList = document.getElementById('list-tasks');

let Ids;
let editing

// save tasks
const saveTask = async (title, description) =>{
   return await db.collection('tasks').doc().set({
       title,
       description
   })
}

const deleteTask = async (id)=>{
   await db.collection('tasks').doc(id).delete();
   
}

const editTask  = async (id)=>{
   const docRef = await db.collection('tasks').doc(id).get();
   const task   = docRef.data();
   task.id      = docRef.id

   form['title'].value        = task.title;
   form['description'].value  = task.description
   form['btn-save'].innerText = "update"
   form['btn-save'].className = "btn btn-success btn-block"
   Ids=task.id  
   editing = true
}

const updateTask = async(title, description)=>{
     const newtask = {
         title,
         description
     }
     await db.collection('tasks').doc(Ids).update(newtask)
     form['btn-save'].innerText="create";
     form['btn-save'].className="btn btn-primary btn-block"
}

const renderTask = (task)=>{
        taskList.innerHTML +=`
        <div class="card m-2 border-primary">
           <div class="card-body text-center">
             <h3>${task.title}</h3>
             <p>${task.description}</p>
             <button class="btn btn-danger btn-delete" data-id="${task.id}" >delete</button>
             <button class="btn btn-primary btn-edit"  data-id="${task.id}">edit</button>
          </div>
    </div>
     `;

    const btnDelete =  document.querySelectorAll('.btn-delete')
     btnDelete.forEach(btn=>{
         btn.addEventListener('click',async (e)=>{
             deleteTask(e.target.dataset.id)
         })
     })

     const btnEdit = document.querySelectorAll('.btn-edit');
     btnEdit.forEach(edit=>{
         edit.addEventListener('click',(e)=>{
             if(e.target.classList.contains('btn-edit')){
                 editTask(e.target.getAttribute('data-id'))
             }
      })
    })
}

const onGettask=(callback)=>{
    db.collection('tasks').onSnapshot(callback)
}

document.addEventListener('DOMContentLoaded',async ()=>{
    const querySnapshot = await db.collection('tasks').get()
    //onchange
    onGettask((querySnapshot)=>{
        taskList.innerHTML =""
        querySnapshot.forEach(doc=>{
            const task = doc.data();
            task.id = doc.id;
            renderTask(task)
        })
    })
    
})

form.addEventListener('submit',async (e)=>{
    e.preventDefault();

    if(editing){
        updateTask(title.value, description.value)
    }else{
     // add data firestore
       saveTask(title.value, description.value)
    } 
    editing=false
    form.reset();
    // title.focus();

});