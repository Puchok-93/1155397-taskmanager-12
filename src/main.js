import {createSiteMenuTemplate} from "./view/main-control.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/edit-task.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";
import {TASK_COUNT, TASK_COUNT_PER_STEP} from "./const.js";

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeaderElement = siteMain.querySelector(`.main__control`);
const createMoreTaskButtonTemplate = () => `<button class="load-more" type="button">load more</button>`;

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMain, createFilterTemplate(filters));
render(siteMain, createBoardTemplate());

const boardElement = siteMain.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);
render(boardElement, createSortTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate(tasks[0]));

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(taskListElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(boardElement, createMoreTaskButtonTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(taskListElement, createTaskTemplate(task)));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
