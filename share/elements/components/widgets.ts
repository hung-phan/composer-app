import {
  color as buttonColor,
  size as buttonSize,
  variant as buttonVariant,
} from "@material-tailwind/react/types/components/button";
import {
  color as inputColor,
  size as inputSize,
  variant as inputVariant,
} from "@material-tailwind/react/types/components/input";
import {
  color as typographyColor,
  variant as typographyVariant,
} from "@material-tailwind/react/types/components/typography";
import { SerializedEditorState } from "lexical";
import { Layouts } from "react-grid-layout";

import { DataContainer, Element, Method } from "../../domain/interfaces";
import { Widget } from "../../domain/widgets";
import { Id } from "../../library/idGenerator";
import { IconType } from "../registry/iconRegistry";

// LAYOUT elements
export class Layout extends Element {
  interfaceName = "Layout";

  direction?: "vertical" | "horizontal";

  items: Element[];
}

export class FragmentLayout extends Element {
  interfaceName = "FragmentLayout";

  items: Element[];
}

// CORE elements
export class Clone extends Element {
  interfaceName = "Clone";

  cloneElementId: Id;
}

export class Text extends Element {
  interfaceName = "Text";

  message: string;
  variant?: typographyVariant;
  color?: typographyColor;
}

export class Link extends Element {
  interfaceName = "Link";

  url: string;
  item: Element;
}

export class Button extends Element {
  interfaceName = "Button";

  type?: "button" | "submit" | "reset";
  variant?: buttonVariant;
  size?: buttonSize;
  color?: buttonColor;
  label?: string;
  onSelected?: Method[];
}

export class IconButton extends Element {
  interfaceName = "IconButton";

  type?: "button" | "submit" | "reset";
  variant?: buttonVariant;
  size?: buttonSize;
  color?: buttonColor;
  icon: Icon;
  onSelected?: Method[];
}

export class Image extends Element {
  interfaceName = "Image";

  src: string;
  alt?: string;
}

export class InputState extends DataContainer {
  interfaceName = "InputState";

  value: string = "";
}

export class Input extends Element {
  interfaceName = "Input";

  variant?: inputVariant;
  size?: inputSize;
  color?: inputColor;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  name?: string;
  label?: string;
  onInputChange?: Method[];
  onEnterKeyPressed?: Method[];
}

export class SelectState extends DataContainer {
  interfaceName = "SelectState";

  value: string;
}

export class Select extends Element {
  interfaceName = "Select";

  defaultValue?: string;
  itemDescriptions: string[];
  itemValues: string[];
  onItemSelected: Method[];
}

export type SimpleTableRow = (string | number)[];

export class Table extends Element {
  interfaceName = "Table";

  headers: SimpleTableRow;
  rows: SimpleTableRow[];
}

export class Form extends Element {
  interfaceName = "Form";

  formId: string;
  action: string;
  method?: "get" | "post";
  fields: FormField[];
  submitButton: Button;
}

export class FormField extends Element {
  interfaceName = "FormField";

  fieldName: string;
  fieldElement: Input;
}

export class Iframe extends Element {
  interfaceName = "Iframe";

  url: string;
}

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export class Modal extends Element {
  interfaceName = "Modal";

  headerItem?: Element;
  bodyItem: Element;
  footerItem?: Element;
}

export class ModalState extends DataContainer {
  interfaceName = "ModalState";

  size?: ModalSize;
  show: boolean = false;
}

export class GridLayout extends Element {
  interfaceName = "GridLayout";

  compactType?: "vertical" | "horizontal" | undefined;
  items: GridLayoutItem[];
}

export class GridLayoutState extends DataContainer {
  interfaceName = "GridLayoutState";

  layouts: Layouts;
  widgets: Widget[] = [];
}

export class GridLayoutItem extends Element {
  interfaceName = "GridLayoutItem";

  item?: Element;
  actionButtons?: Button[];
}

export class Icon extends Element {
  interfaceName = "Icon";

  icon: IconType;
}

export class ContextMenu extends Element {
  interfaceName = "ContextMenu";

  icon: Icon;
  items: {
    description: string;
    methods: Method[];
  }[];
}

export class HTML extends Element {
  interfaceName = "HTML";

  html: string;
}

export class Editor extends Element {
  interfaceName = "Editor";

  editable: boolean = true;
}

export class EditorState extends DataContainer {
  interfaceName = "EditorState";

  value?: SerializedEditorState;
}
