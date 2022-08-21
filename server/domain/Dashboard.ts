import { Layouts } from "react-grid-layout";
import { Widget } from "share/domain/widgets";
import { getRandomSortableId } from "share/library/idGenerator";

export class Dashboard {
  id = getRandomSortableId();
  title: string;
  layouts: Layouts;
  widgets: Widget[];
}
