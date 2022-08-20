import { Builder } from "builder-pattern";

const scheduleImmediately =
  process.env.ENVIRONMENT === "client"
    ? (cb) => setTimeout(cb, 0)
    : setImmediate;

class Task<T> {
  func: (...args: any[]) => T;
  args: any[];
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export class TaskQueue {
  static BATCH_SIZE = 32;

  readonly tasks: Task<unknown>[] = [];

  running = false;
  queued = false;

  run<T>(func: (...args: any[]) => T, ...args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tasks.push(
        Builder(Task)
          .func(func)
          .args(args)
          .resolve(resolve)
          .reject(reject)
          .build()
      );

      this.queueDispatcher();
    });
  }

  private queueDispatcher(): void {
    if (this.tasks.length === 0) {
      return;
    }

    if (!(this.queued && this.running)) {
      this.queued = true;

      scheduleImmediately(() => {
        let count = 0;

        this.running = true;
        this.queued = false;

        while (this.tasks.length > 0 && count < TaskQueue.BATCH_SIZE) {
          const task: Task<unknown> = this.tasks.pop();

          try {
            task.resolve(task.func.call(null, ...task.args));
          } catch (e) {
            task.reject(e);
          }

          count += 1;
        }

        this.running = false;

        if (this.tasks.length > 0) {
          this.queueDispatcher();
        }
      });
    }
  }
}

let taskQueue: TaskQueue | null = null;

export default function getTaskQueue() {
  if (process.env.ENVIRONMENT === "client") {
    if (taskQueue === null) {
      taskQueue = new TaskQueue();
    }

    return taskQueue;
  }

  return new TaskQueue();
}
