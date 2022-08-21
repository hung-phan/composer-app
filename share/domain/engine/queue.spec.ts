import _ from "lodash";

import getTaskQueue from "./queue";

describe("coreEngineQueue", () => {
  test("should queue the task and resolve it correctly", async () => {
    const taskQueue = getTaskQueue();

    const result = await taskQueue.run(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
          });
        })
    );

    expect(result).toEqual(1);
  });

  test("should resolve all the result correctly", async () => {
    const taskQueue = getTaskQueue();
    const values = _.range(0, 1000);

    const results = await Promise.all(
      values.map((value) =>
        taskQueue.run(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(value);
              }, Math.floor(Math.random() * 1000));
            })
        )
      )
    );

    expect(results).toEqual(values);
  });
});
