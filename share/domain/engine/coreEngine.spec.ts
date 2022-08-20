import { makeStore } from "../../store";
import {
  ButtonElement,
  ImageElement,
  LayoutElement,
  PlaceholderElement,
  RenderElementMethod,
  StateHolderElement,
  TextElement,
  UpdateElementMethod, UpdateInListElementMethod,
} from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { ROOT_ID, actions } from "./index";

describe("coreEngine", () => {
  test("engineDispatch should update the store correctly", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id(ROOT_ID)
            .elements([
              TextElement.builder().id("text_element").build(),
              ImageElement.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              ButtonElement.builder().id("button_element").build(),
              PlaceholderElement.builder().id("placeholder_element").build(),
              StateHolderElement.builder()
                .id("stateholder_element")
                .elementState({ data: ["string_data"] })
                .build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          ImageElement.builder()
            .id("image_element")
            .src("https://amazon.com")
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          LayoutElement.builder()
            .id("placeholder_element")
            .elements([
              TextElement.builder()
                .id("new_text_element")
                .message("new text element message")
                .build(),
              PlaceholderElement.builder()
                .id("nested_placeholder_element_1")
                .build(),
              PlaceholderElement.builder()
                .id("nested_placeholder_element_2")
                .build(),
            ])
            .build()
        )
        .build(),
    ]);

    store.dispatch(
      actions.delElement({
        id: "placeholder_element",
        interfaceName: PlaceholderElement.getInterfaceName(),
      })
    );

    expect(store.getState()).toMatchSnapshot();

    await engineDispatch(store.dispatch, [
      UpdateElementMethod.builder()
        .id("nested_placeholder_element_1")
        .element(
          ImageElement.builder()
            .id("new_image_element")
            .build()
        )
        .build(),
    ]);

    store.dispatch(
      actions.delElement({
        id: "nested_placeholder_element_1",
        interfaceName: PlaceholderElement.getInterfaceName(),
      })
    );

    expect(store.getState()).toMatchSnapshot();

    await engineDispatch(store.dispatch, [
      UpdateInListElementMethod.builder()
        .id("nested_placeholder_element_2")
        .elements([
          ImageElement.builder()
            .id("new_image_element_1")
            .build(),
          ImageElement.builder()
            .id("new_image_element_2")
            .build()
        ])
        .build(),
    ]);

    store.dispatch(
      actions.delElement({
        id: "nested_placeholder_element_2",
        interfaceName: PlaceholderElement.getInterfaceName(),
      })
    );

    expect(store.getState()).toMatchSnapshot();
  });
});
