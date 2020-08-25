import Abstract from "./abstract.js";

const createNoTaskTemolate = () => {
  return (
    `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
    </p>`);
};

export default class SiteNoTask extends Abstract {
  getTemplate() {
    return createNoTaskTemolate();
  }
}
