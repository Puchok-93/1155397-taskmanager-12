import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/render.js";
import {TASK_COUNT} from "./const.js";

import SiteMenu from "./view/main-control.js";
import SiteFilter from "./view/filter.js";

import BoardPresenter from "./presenter/board.js";


const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);
const siteMain = document.querySelector(`.main`);
const siteHeaderElement = siteMain.querySelector(`.main__control`);


render(siteHeaderElement, new SiteMenu().getElement()); // Отрисовываем меню
render(siteMain, new SiteFilter(filters).getElement()); // Отрисовываем фильтры


const boardPresenter = new BoardPresenter(siteMain);
boardPresenter.init(tasks);
