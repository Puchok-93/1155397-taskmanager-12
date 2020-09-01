import SiteBoard from "../view/board.js";
import SiteSort from "../view/sort.js";
import SiteTaskList from "../view/task-list.js";
import SiteMoreButton from "../view/load-more-button.js";
import SiteNoTask from "../view/no-task.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SortType} from "../const.js";
import {updateItem} from "../utils/common.js";

import TaskPresenter from "./task.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {

  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new SiteBoard();
    this._sortComponent = new SiteSort();
    this._taskListComponent = new SiteTaskList();
    this._noTaskComponent = new SiteNoTask();
    this._siteLoadMoreButtonComponent = new SiteMoreButton();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  /* ----------------------------------------------- Инициализация  -----------------------------------------------*/
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);
    this._renderBoard();
  }

  _handleModeChange() {
    Object
    .values(this._taskPresenter)
    .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  /* ----------------------------------------------- Сортируем задачи ----------------------------------------------- */

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  /* ----------------------------------------------- Отрисовываем сортировку ----------------------------------------------- */

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  /* ----------------------------------------------- Отрисовываем карточку задачи ----------------------------------------------- */

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  /* ----------------------------------------------- Отрисовываем задачи ----------------------------------------------- */

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

  /* ----------------------------------------------- Отрисовываем заглушку ----------------------------------------------- */

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._siteLoadMoreButtonComponent);
    }
  }

  /* ----------------------------------------------- Отрисовываем кнопку load more ----------------------------------------------- */

  _renderLoadMoreButton() {
    render(this._boardComponent, this._siteLoadMoreButtonComponent);
    this._siteLoadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  /* ----------------------------------------------- Очищаем список задач ----------------------------------------------- */

  _clearTaskList() {
    Object
    .values(this._taskPresenter)
    .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  /* ----------------------------------------------- Отрисовываем список задач ----------------------------------------------- */

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  /* ----------------------------------------------- Отрисовываем доску ----------------------------------------------- */

  _renderBoard() {
    const isAllTasksIsArchive = this._boardTasks.every((task) => task.isArchive);

    if (isAllTasksIsArchive) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
