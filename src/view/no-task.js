import {createElement} from "../utils.js";

const createNoTaskTemolate = () => {
  return (
    `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
    </p>`);
};

export default class SiteNoTask {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTaskTemolate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
