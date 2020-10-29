import Task from "./Task";

export default class Matter {

    name: string;

    teacher: string;

    tasks: Task[];

    constructor(name: string, teacher: string, tasks: Task[]) {
        this.name = name;
        this.teacher = teacher;
        this.tasks = tasks;
    }
}