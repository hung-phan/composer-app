import { Id, getRandomSortableId } from "../../library/idGenerator";

export abstract class Widget {
  abstract type: string;
  id: Id = getRandomSortableId();
}
