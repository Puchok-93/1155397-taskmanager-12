import Abstract from "./abstract.js";

const createTaskListTemplate = () => {
  return (`<div class="board__tasks"></div>`
  );
};

export default class SiteTaskList extends Abstract {
  getTemplate() {
    return createTaskListTemplate();
  }
}
