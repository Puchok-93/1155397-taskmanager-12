import Abstract from "./abstract.js";

const createBoardTemplate = () => {
  return (`<section class="board container"></section>`
  );
};

export default class SiteBoard extends Abstract {
  getTemplate() {
    return createBoardTemplate();
  }
}
