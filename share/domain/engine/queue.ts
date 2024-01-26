const scheduleImmediately =
  process.env.ENVIRONMENT === "client"
    ? (cb) => setTimeout(cb, 0)
    : setImmediate;

interface Task<T> {
  func: (...args: any[]) => T;
  args: any[];
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export class TaskQueue {
  static DEFAULT_BATCH_SIZE = 32;

  batchSize: number = TaskQueue.DEFAULT_BATCH_SIZE;

  private tasks: Task<any>[] = [];
  private running = false;
  private queued = false;

  run<T>(func: (...args: any[]) => T, ...args: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        func,
        args,
        resolve,
        reject,
      });

      this.queueDispatcher();
    });
  }

  private queueDispatcher(): void {
    if (this.tasks.length === 0) {
      return;
    }

    if (!this.queued && !this.running) {
      this.queued = true;

      scheduleImmediately(() => {
        this.queued = false;
        this.running = true;

        let count = 0;

        while (this.tasks.length > 0 && count < this.batchSize) {
          const task: Task<any> = this.tasks.pop()!;

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

export default function getTaskQueue() {
  return new TaskQueue();
}
