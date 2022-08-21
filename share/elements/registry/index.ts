import * as core from "../../domain/interfaces/core";
import * as components from "../components";
import * as widgets from "../components/widgets";
import * as templateComponents from "../templateComponents";
import * as templates from "../templateComponents/templates";
import { registerElements } from "./elementRegistry";
import { registerInterfaces } from "./interfaceRegistry";

registerInterfaces([
  core.Method,
  core.Node,
  core.Element,
  core.InvokeExternalMethod,
  core.UpdateStateMethod,
  core.RenderElementMethod,
  core.BatchRenderElementMethod,
  core.UpdateElementMethod,
  core.AddInListElementMethod,
  core.UpdateInListElementMethod,
  core.DeleteInListElementMethod,
  core.HttpMethod,
  core.NavigateMethod,
  core.Response,
]);

registerElements([
  {
    interfaceClass: core.DataContainer,
    elementClass: components.DataContainerComponent,
  },
  {
    interfaceClass: core.Placeholder,
    elementClass: components.PlaceholderComponent,
  },
  {
    interfaceClass: templates.DefaultTemplate,
    elementClass: templateComponents.DefaultTemplateComponent,
  },
  {
    interfaceClass: templates.PeriodicTemplate,
    elementClass: templateComponents.PeriodicTemplateComponent,
  },
  {
    interfaceClass: widgets.Layout,
    elementClass: components.LayoutComponent,
  },
  {
    interfaceClass: widgets.FragmentLayout,
    elementClass: components.FragmentLayoutComponent,
  },
  {
    interfaceClass: widgets.GridLayout,
    dataContainerClass: widgets.GridLayoutState,
    elementClass: components.GridLayoutComponent,
  },
  {
    interfaceClass: widgets.GridLayoutItem,
    elementClass: components.GridLayoutItemComponent,
  },
  {
    interfaceClass: widgets.ContextMenu,
    elementClass: components.ContextMenuComponent,
  },
  {
    interfaceClass: widgets.Clone,
    elementClass: components.CloneComponent,
  },
  {
    interfaceClass: widgets.Text,
    elementClass: components.TextComponent,
  },
  {
    interfaceClass: widgets.Link,
    elementClass: components.LinkComponent,
  },
  {
    interfaceClass: widgets.Image,
    elementClass: components.ImageComponent,
  },
  {
    interfaceClass: widgets.Button,
    elementClass: components.ButtonComponent,
  },
  {
    interfaceClass: widgets.IconButton,
    elementClass: components.IconButtonComponent,
  },
  {
    interfaceClass: widgets.Table,
    elementClass: components.TableComponent,
  },
  {
    interfaceClass: widgets.Input,
    dataContainerClass: widgets.InputState,
    elementClass: components.InputComponent,
  },
  {
    interfaceClass: widgets.Select,
    dataContainerClass: widgets.SelectState,
    elementClass: components.SelectComponent,
  },
  {
    interfaceClass: widgets.Form,
    elementClass: components.FormComponent,
  },
  {
    interfaceClass: widgets.FormField,
    elementClass: components.FormFieldComponent,
  },
  {
    interfaceClass: widgets.Iframe,
    elementClass: components.IframeComponent,
  },
  {
    interfaceClass: widgets.Modal,
    dataContainerClass: widgets.ModalState,
    elementClass: components.ModalComponent,
  },
  {
    interfaceClass: widgets.HTML,
    elementClass: components.HTMLComponent,
  },
  {
    interfaceClass: widgets.Icon,
    elementClass: components.IconComponent,
  },
  {
    interfaceClass: widgets.Editor,
    dataContainerClass: widgets.EditorState,
    elementClass: components.EditorComponent,
  },
]);

export * from "./interfaceRegistry";
export * from "./elementRegistry";
