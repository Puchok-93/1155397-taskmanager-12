import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";
import {TASK_COUNT, TASK_COUNT_PER_STEP} from "./const.js";

import SiteMenu from "./view/main-control.js";
import SiteFilter from "./view/filter.js";
import SiteBoard from "./view/board.js";
import SiteSort from "./view/sort.js";
import SiteTaskList from "./view/task-list.js";
import SiteTask from "./view/task.js";
import TaskEdit from "./view/edit-task.js";
import SiteMoreButton from "./view/load-more-button.js";
import SiteNoTask from "./view/no-task.js";

const boardComponent = new SiteBoard();
const taskListComponent = new SiteTaskList();
const boardComponentElement = boardComponent.getElement();
const taskListComponentElement = taskListComponent.getElement();

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeaderElement = siteMain.querySelector(`.main__control`);

const EscButton = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

const renderTask = (taskListElement, task) => {
  const taskComponent = new SiteTask(task);
  const taskEditComponent = new TaskEdit(task);
  const taskEditComponentElement = taskEditComponent.getElement();
  const taskComponentElement = taskComponent.getElement();

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponentElement, taskComponentElement);
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponentElement, taskEditComponentElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === EscButton.ESCAPE || evt.key === EscButton.ESC) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponentElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponentElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponentElement);
};

render(siteHeaderElement, new SiteMenu().getElement());
render(siteMain, new SiteFilter(filters).getElement());
render(siteMain, boardComponentElement);

const renderTasks = (tasks) => {
  const isAllTasksIsArchive = tasks.every((task) => task.isArchive);

  if (isAllTasksIsArchive) {
    render(boardComponentElement, new SiteNoTask().getElement());
    return;
  }

  render(boardComponentElement, new SiteSort().getElement());
  render(boardComponentElement, taskListComponentElement);

  for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
    renderTask(taskListComponentElement, tasks[i]);
  }

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;
    const loadMoreButtonComponent = new SiteMoreButton();
    const loadMoreButtonComponentElement = loadMoreButtonComponent.getElement();

    render(boardComponentElement, loadMoreButtonComponentElement);
    loadMoreButtonComponentElement.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponentElement, task));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= tasks.length) {
        loadMoreButtonComponentElement.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

renderTasks(tasks);
