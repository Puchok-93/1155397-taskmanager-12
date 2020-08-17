import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {RenderPosition, render} from "./utils.js";
import {TASK_COUNT, TASK_COUNT_PER_STEP} from "./const.js";

import SiteMenu from "./view/main-control.js";
import SiteFilter from "./view/filter.js";
import SiteBoard from "./view/board.js";
import SiteSort from "./view/sort.js";
import SiteTaskList from "./view/task-list.js";
import SiteTask from "./view/task.js";
import TaskEdit from "./view/edit-task.js";
import SiteMoreButton from "./view/load-more-button.js";

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeaderElement = siteMain.querySelector(`.main__control`);


const renderTask = (taskListElement, task) => {
  const taskComponent = new SiteTask(task);
  const taskEditComponent = new TaskEdit(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenu().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new SiteFilter(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new SiteBoard();
render(siteMain, boardComponent.getElement(), RenderPosition.BEFOREEND);
render(boardComponent.getElement(), new SiteSort().getElement(), RenderPosition.AFTERBEGIN);

const taskListComponent = new SiteTaskList();
render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);
render(taskListComponent.getElement(), new TaskEdit(tasks[0]).getElement(), RenderPosition.BEFOREEND);

const count = Math.min(tasks.length, TASK_COUNT_PER_STEP);
for (let i = 1; i < count; i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  const loadMoreButtonComponent = new SiteMoreButton();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTask(taskListComponent.getElement(), task));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
