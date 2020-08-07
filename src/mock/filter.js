import {isTaskExpired, isTaskRepeating, isTaskExpiringToday} from "../utils.js";

const filter = {
  all: 0,
  overdue: 0,
  today: 0,
  favorites: 0,
  repeating: 0,
  archive: 0
};

export const generateFilter = (tasks) => {
  filter.all = tasks.length;

  tasks.forEach((task) => {
    if (isTaskExpired(task.dueDate)) {
      filter.overdue++;
    } else if (isTaskExpiringToday(task.dueDate)) {
      filter.today++;
    } else if (isTaskRepeating(task.repeating)) {
      filter.repeating++;
    } else if (task.isArchive) {
      filter.archive++;
    } else if (task.isFavorite) {
      filter.favorites++;
    }
  });

  return Object.entries(filter).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks,
    };
  });
};
