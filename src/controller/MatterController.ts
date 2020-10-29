import Matter from '../model/Matter';
import dateformat from 'dateformat';
import Task from '../model/Task';

export default {
  getMatterByName(matters: Matter[], name: string) {
    return matters.find((m) => m.name.toLowerCase() === name.toLowerCase());
  },

  getTime(time: string) {
    let dt = new Date(Number(time));
    return dateformat(dt, 'dd/mm/yyyy hh:MM:ss');
  },

  getColor(task: Task) {
    let s = '';

    if (this.past(task)) {
      s = 'F2542D';
    } else {
      let diff = this.diff(task);

      let days = diff / (1000 * 3600 * 24);

      if (days <= 8) {
        s = 'ffee6b';
      } else {
        s = '0E9594';
      }
    }

    return s;
  },

  getRemainingTime(task: Task) {
    let s = '';

    if (this.past(task)) {
      s = 'Já passou';
    } else {
      let diff = this.diff(task);

      let days = diff / (1000 * 3600 * 24);

      s = `${days.toFixed(1)} dia's`;
    }

    return s;
  },

  diff(task: Task): number {
    return Number(task.deliveryTime) - new Date().getTime();
  },

  past(task: Task): boolean {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return Number(task.deliveryTime) < today.getTime();
  },
};
