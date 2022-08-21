import { Builder } from "builder-pattern";
import { SerializedEditorState } from "lexical";
import { DeleteWidgetFromDashboardPrepareInvoke } from "pages/api/skills/dashboard/deleteWidgetFromDashboard";
import { UpdateInputModalPrepareInvoke } from "pages/api/skills/dashboard/modal/updateInputModal";
import { CreateWidgetPrepareInvoke } from "pages/api/skills/dashboard/widgets/createWidget";
import { UpdateWidgetPrepareInvoke } from "pages/api/skills/dashboard/widgets/updateWidget";
import { ShowAndHideModalPrepareInvoke } from "pages/api/skills/modal/showAndHideModal";
import { ShowConfirmationDialogPrepareInvoke } from "pages/api/skills/modal/showConfirmationDialog";
import { DEFAULT_MODAL_CONFIG } from "server/application/modal/config";
import {
  EditorWidget,
  IframeWidget,
  WidgetType,
} from "server/domain/widgets/types";
import {
  BatchRenderElementMethod,
  DataContainer,
  Element,
  Method,
  Placeholder,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";
import {
  Button,
  Editor,
  EditorState,
  FragmentLayout,
  Icon,
  IconButton,
  Iframe,
  Input,
  InputState,
  Layout,
} from "share/elements/components/widgets";

export function getWidgetActionButtons(widget: Widget): Button[] {
  return [
    IconButton.builder()
      .variant("text")
      .icon(Icon.builder().icon("MdOutlineEdit").class("w-6 h-6").build())
      .onSelected(UpdateInputModalPrepareInvoke(widget))
      .build(),
    IconButton.builder()
      .variant("text")
      .icon(Icon.builder().icon("MdOutlineClear").class("w-6 h-6").build())
      .color("red")
      .onSelected(
        ShowConfirmationDialogPrepareInvoke(
          DEFAULT_MODAL_CONFIG,
          "Are you sure you want to delete this widget?",
          DeleteWidgetFromDashboardPrepareInvoke(widget)
        )
      )
      .build(),
  ];
}

export function renderWidgetInputModal({
  widgetType,
  widgetIndex,
  currentWidget,
}: {
  widgetType: WidgetType;
  widgetIndex: number;
  currentWidget?: Widget;
}): Method[] {
  const cancelButton = Button.builder()
    .variant("text")
    .color("red")
    .label("Cancel")
    .onSelected(
      ShowAndHideModalPrepareInvoke({
        modalConfig: DEFAULT_MODAL_CONFIG,
        show: false,
      })
    )
    .build();

  switch (widgetType) {
    case WidgetType.IFRAME_WIDGET: {
      const inputState = InputState.builder().build();

      if (currentWidget) {
        inputState.value = (currentWidget as IframeWidget).url;
      }

      const confirmMethods = currentWidget
        ? UpdateWidgetPrepareInvoke(currentWidget, widgetIndex, [inputState])
        : CreateWidgetPrepareInvoke(WidgetType.IFRAME_WIDGET, [inputState]);

      return [
        BatchRenderElementMethod.builder()
          .elements([
            Layout.builder()
              .id(DEFAULT_MODAL_CONFIG.bodyPlaceholder)
              .items([
                Input.builder()
                  .stateId(inputState.id)
                  .label("Enter website link")
                  .onEnterKeyPressed(confirmMethods)
                  .build(),
                inputState,
              ])
              .build(),
            Layout.builder()
              .id(DEFAULT_MODAL_CONFIG.footerPlaceholder)
              .direction("horizontal")
              .items([
                cancelButton,
                Button.builder()
                  .label(currentWidget ? "Update" : "Create")
                  .onSelected(confirmMethods)
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ];
    }

    case WidgetType.EDITOR_WIDGET: {
      const editorState = EditorState.builder().build();

      if (currentWidget) {
        editorState.value = (currentWidget as EditorWidget).state;
      }

      return [
        BatchRenderElementMethod.builder()
          .elements([
            FragmentLayout.builder()
              .id(DEFAULT_MODAL_CONFIG.bodyPlaceholder)
              .items([
                Editor.builder().stateId(editorState.id).build(),
                editorState,
              ])
              .build(),
            Layout.builder()
              .id(DEFAULT_MODAL_CONFIG.footerPlaceholder)
              .direction("horizontal")
              .items([
                cancelButton,
                Button.builder()
                  .label(currentWidget ? "Update" : "Create")
                  .onSelected(
                    currentWidget
                      ? UpdateWidgetPrepareInvoke(currentWidget, widgetIndex, [
                          editorState,
                        ])
                      : CreateWidgetPrepareInvoke(WidgetType.EDITOR_WIDGET, [
                          editorState,
                        ])
                  )
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ];
    }

    case WidgetType.EMPTY_WIDGET: {
      return [];
    }
  }
}

export function extractWidgetData({
  widgetType,
  dataContainers,
  currentWidget,
}: {
  widgetType: WidgetType;
  dataContainers?: DataContainer[];
  currentWidget?: Widget;
}): { widget: Widget; element: Element } {
  let widget, element;

  switch (widgetType) {
    case WidgetType.IFRAME_WIDGET: {
      const url: string | undefined = (dataContainers?.[0] as InputState)
        ?.value;

      if (url === undefined) {
        throw new Error(
          `Invalid data container for ${WidgetType.IFRAME_WIDGET}: ${dataContainers}`
        );
      }

      widget = Builder(IframeWidget).url(url).build();
      element = Iframe.builder().url(url).build();

      break;
    }

    case WidgetType.EDITOR_WIDGET: {
      const state: SerializedEditorState | undefined = (dataContainers?.[0] as EditorState)
        ?.value;

      if (state === undefined) {
        throw new Error(
          `Invalid data container for ${WidgetType.EDITOR_WIDGET}: ${dataContainers}`
        );
      }

      const editorState = EditorState.builder().value(state).build();

      widget = Builder(EditorWidget).state(state).build();
      element = FragmentLayout.builder()
        .items([
          Editor.builder().stateId(editorState.id).editable(false).build(),
          editorState,
        ])
        .build();

      break;
    }

    case WidgetType.EMPTY_WIDGET: {
      widget = Builder(EditorWidget).build();
      element = Placeholder.builder().build();
    }
  }

  if (currentWidget !== undefined) {
    widget.id = currentWidget.id;
  }

  return {
    widget,
    element,
  };
}
