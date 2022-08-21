import {
  Button,
  Image,
  InputState,
  Layout,
  Text,
} from "../../elements/components/widgets";
import { makeStore } from "../../store";
import {
  Placeholder,
  RenderElementMethod,
  UpdateElementMethod,
  UpdateInListElementMethod,
} from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { ROOT_ID } from "./index";

describe("coreEngine", () => {
  test("should update the store correctly", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id(ROOT_ID)
            .items([
              Text.builder().id("text_element").build(),
              Image.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              Button.builder().id("button_element").build(),
              Placeholder.builder().id("placeholder_element").build(),
              InputState.builder()
                .id("stateholder_element")
                .value("string_data")
                .build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support override element with RenderElementMethod", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id(ROOT_ID)
            .items([
              Image.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              Placeholder.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id("placeholder_element")
            .items([
              Text.builder().id("text_element").build(),
              Button.builder().id("button_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should remove element with RenderElementMethod", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id(ROOT_ID)
            .items([
              Image.builder()
                .id("image_element")
                .src("https://google.com")
                .build(),
              Layout.builder()
                .id("placeholder_element")
                .items([
                  Text.builder().id("text_element").build(),
                  Button.builder().id("button_element").build(),
                ])
                .build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(Placeholder.builder().id("placeholder_element").build())
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support list replacement with same id", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id(ROOT_ID)
            .items([
              Text.builder().id("text_element_1").build(),
              Placeholder.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      UpdateInListElementMethod.builder()
        .id("placeholder_element")
        .elements([
          Text.builder().id("text_element_2").build(),
          Placeholder.builder().id("placeholder_element").build(),
        ])
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });

  test("should support nested element update with same id", async () => {
    const store = makeStore({});

    await engineDispatch(store.dispatch, [
      RenderElementMethod.builder()
        .element(
          Layout.builder()
            .id(ROOT_ID)
            .items([
              Image.builder().id("image_element_1").build(),
              Placeholder.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    await engineDispatch(store.dispatch, [
      UpdateElementMethod.builder()
        .id("placeholder_element")
        .element(
          Layout.builder()
            .id("nested_layout_element")
            .items([
              Image.builder().id("image_element_2").build(),
              Placeholder.builder().id("placeholder_element").build(),
            ])
            .build()
        )
        .build(),
    ]);

    expect(store.getState()).toMatchSnapshot();
  });
});
