import {createMainControlTemplate} from "./view/main-control.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createEditTaskTemplate} from "./view/edit-task.js";
import {createTaskTemplate} from "./view/task.js";

const TASK_COUNT = 3;

const siteMain = document.querySelector(`.main`);
const siteHeaderElement = siteMain.querySelector(`.main__control`);

const createMoreTaskButtonTemplate = () => ` <button class="load-more" type="button">load more</button>`;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createMainControlTemplate(), `beforeend`);
render(siteMain, createFilterTemplate(), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const boardElement = document.querySelector(`.board`);
const taskListElement = document.querySelector(`.board__tasks`);

render(boardElement, createSortTemplate(), `afterBegin`);
render(taskListElement, createEditTaskTemplate(), `beforeend`);

for (let i = 0; i <= TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate(), `beforeend`);
}

render(taskListElement, createMoreTaskButtonTemplate(), `beforeend`);
