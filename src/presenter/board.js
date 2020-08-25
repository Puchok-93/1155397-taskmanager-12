import SiteBoard from "../view/board.js";
import SiteSort from "../view/sort.js";
import SiteTaskList from "../view/task-list.js";
import SiteTask from "../view/task.js";
import TaskEdit from "../view/edit-task.js";
import SiteMoreButton from "../view/load-more-button.js";
import SiteNoTask from "../view/no-task.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const TASK_COUNT_PER_STEP = 8;

const EscButton = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new SiteBoard();
    this._sortComponent = new SiteSort();
    this._taskListComponent = new SiteTaskList();
    this._noTaskComponent = new SiteNoTask();
    this._siteLoadMoreButtonComponent = new SiteMoreButton();

    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);
    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskComponent = new SiteTask(task);
    const taskEditComponent = new TaskEdit(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === EscButton.ESCAPE || evt.key === EscButton.ESC) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListComponent, taskComponent);
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

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

  _renderLoadMoreButton() {
    render(this._boardComponent, this._siteLoadMoreButtonComponent);
    this._siteLoadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

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
