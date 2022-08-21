import { Element, Method } from "../../domain/interfaces";
import { Id, getRandomUUID } from "../../library/idGenerator";

// TEMPLATE element
export class Template extends Element {
  interfaceName = "Template";

  ownerId: Id = getRandomUUID();
}

export class DefaultTemplate extends Template {
  interfaceName = "DefaultTemplate";

  widgets: Element[];
}

export class PeriodicTemplate extends DefaultTemplate {
  interfaceName = "PeriodicTemplate";

  intervalInMs: number;
  methods: Method[];
}
