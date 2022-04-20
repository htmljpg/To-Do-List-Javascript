import view from '../views/TodosPage.html';
import $ from '../plugins';
import { BASE_URL } from '../constants/api';
import useFetch from '../utils/useFetch';
import useAnim from '../utils/useAnim';

let addModal = addOrEdit('add');

function addOrEdit (type, data = {}) {
    console.log('data', data);
    
    let modalTitle = '';
    let btnPrimary = {};
    let formId = '';

    if (type === 'add') {
        modalTitle = 'Add new task';
        btnPrimary = {text: 'Add', type: 'primary', handler() {
                
        }, submitForm: 'addTodo'};
        formId = 'addTodo';
    }
    if (type === 'edit') {
        modalTitle = `Edit task`;
        btnPrimary = {text: 'Edit', type: 'primary', handler() {
                
        }, submitForm: 'editTodo'};
        formId = 'editTodo';
    }


    const modal = $.modal({
        title: modalTitle,
        closable: true,
        width: '400px',
        content: `
            <form id=${formId}>
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" value="${type === 'edit' ? data.title : ''}" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3" name="description" required>${type === 'edit' ? data.description : ''}</textarea>
                </div>
            </form>
        `,
        footerButtons: [
            btnPrimary,
            {text: 'Cancel', type: 'danger', handler() {
                modal.close();
            }}
        ]
    });

    return modal;
}


function todoToHTML (todoList, { id, title, description }, withoutAnim) {
    todoList.innerHTML = '';
    const html = `
        <li class="todo-item animate__animated">
            <div class="row d-flex justify-content-between">
                <div class="col-auto flex-grow-1">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <div class="col-auto">
                    <button class="btn btn-md btn-primary edit" data-title="${title}" data-id="${id}">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-md btn-danger delete" data-title="${title}" data-id="${id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        </li>
    `;

    if (withoutAnim) {
        todoList.insertAdjacentHTML('beforeend', html)
    } else {
        useAnim(() => todoList.insertAdjacentHTML('beforeend', html), todoList)
    }
}

async function getAllTodos(todoList, withoutAnim) {
    const response = await useFetch(BASE_URL + 'tasks');
    

    if (response) {
        response.length > 0 ? response.forEach(todo => todoToHTML(todoList, todo, withoutAnim)) : todoList.innerHTML = 'empty';
    }
}

function getData(form) {
    const title = form.title.value;
    const description = form.description.value;

    const formData = {
        title,
        description,
    }

    form.reset();
    
    return formData;
}

async function addTodo(e, todoList) {
    e.preventDefault();
    const formData = getData(e.currentTarget);
    
    const response = await useFetch(BASE_URL + 'tasks', 'post', formData);

    responseCheckAndInfo(response, 'Add', `Task <b>${response.title}</b> added successfully!`, 'add', '');

    getAllTodos(todoList);
}

async function editTodo(e, todoList, id, modalBlock) {
    console.log('id', e);
    e.preventDefault();
    const formData = getData(e.currentTarget);

    const response = await useFetch(BASE_URL + `tasks/${id}`, 'PUT', formData);

    responseCheckAndInfo(response, 'Edit', `Task <b>${response.title}</b> edited successfully!`, 'edit', '', modalBlock);

    getAllTodos(todoList);
}

async function deleteTodo(todoId, todoTitle, elementParent, todoList) {
    const response = await useFetch(BASE_URL + `tasks/${todoId}`, 'delete');
    
    responseCheckAndInfo(response, 'Remove', `Task <b>${todoTitle}</b> was successfully deleted!`, 'delete', elementParent, "", todoList);
}

function responseCheckAndInfo(response, title, content, type, elementParent, modalBlock, todoList) {

    if (response) {

        if (type == 'add') {
            addModal.close();
        }

        if (type == 'edit') {
            modalBlock.destroy();
        }

        setTimeout(() => {
            const alert = $.alert({
                title,
                content,
            })
                .then(() => {
                    if (type === 'delete') {
                        useAnim(() => elementParent.remove(), elementParent, 500, null, "animate__bounceOutRight");
                        setTimeout(() => {
                            getAllTodos(todoList, true);
                        }, 700);
                    }
                })
            
            
        }, 200);

    } else {
        const errorInfo = $.alert({
            title: `Error`,
            content: 'Something went wrong. Please try again later!',
        });

        if (type == 'add') {
            addModal.close();
        }

        setTimeout(() => {
            errorInfo.open();
        }, 200);
    }
}

const TodosPage = async () => {
  const divElement = document.createElement("div");
  divElement.innerHTML = view;
  let todoList = divElement.querySelector('#todos-list');
  const addTodoForm = document.getElementById('addTodo');
  let editModal = new Function;
  
  todoList.addEventListener('click', (e) => {
    const target = e.target;

    if (
        (target.classList.contains('delete') || target.parentElement.classList.contains('delete')) &&
        (target.dataset.id || target.parentElement.dataset.id)
    ) {
        const id = +target.dataset.id || +target.parentElement.dataset.id;
        const title = target.dataset.title || target.parentElement.dataset.title;

        $.confirm({
            title: 'Are you sure ?',
            content: `You delete <b>${title}</b> task`,
        })
            .then(() => {
                deleteTodo(id, title, target.closest('.todo-item'), todoList);
            })
            .catch(() => {});
    }

    if (
        (target.classList.contains('edit') || target.parentElement.classList.contains('edit')) &&
        (target.dataset.id || target.parentElement.dataset.id)
    ) {
        const id = +target.dataset.id || +target.parentElement.dataset.id;
        const title = target.dataset.title || target.parentElement.dataset.title;

        (async () => {
            const response = await useFetch(BASE_URL + `tasks/${id}`, 'get');

            const {
                title,
                description
            } = response;
            
            if (response) {
                editModal = addOrEdit('edit', { title, description });
                editModal.open();
                const editTodoForm = document.getElementById('editTodo');
                editTodoForm.addEventListener('submit', (e) => editTodo(e, todoList, id, editModal));
            }
        })();
    }
  });
  
  const addBtn = divElement.querySelector('#add');
  addBtn.addEventListener('click', () => {
    addModal.open();
  });
  await getAllTodos(todoList);

  addTodoForm.addEventListener('submit', (e) => addTodo(e, todoList));
  

  return divElement;
};

export default TodosPage;
