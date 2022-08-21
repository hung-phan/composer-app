import { SerializedEditorState } from "lexical";
import { Widget } from "share/domain/widgets";

export enum WidgetType {
  IFRAME_WIDGET = "IFRAME_WIDGET",
  EDITOR_WIDGET = "EDITOR_WIDGET",
  EMPTY_WIDGET = "EMPTY_WIDGET",
}

export class IframeWidget extends Widget {
  type = WidgetType.IFRAME_WIDGET;
  url: string;
}

export class EditorWidget extends Widget {
  type = WidgetType.EDITOR_WIDGET;
  state?: SerializedEditorState;
}

export class EmptyWidget extends Widget {
  type = WidgetType.EMPTY_WIDGET;
}
