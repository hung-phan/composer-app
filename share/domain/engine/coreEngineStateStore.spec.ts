import {
  Element,
  LayoutElement,
  PlaceholderElement,
} from "../interfaces";
import { actions, reducer } from "./coreEngineStateStore";
import { ROOT_ID } from "./index";

test("setElement", () => {
  let state = {};

  state = reducer(
    state,
    actions.setElement({
      element: Element.builder().id(ROOT_ID).build(),
    })
  );
  state = reducer(
    state,
    actions.setElement({
      element: Element.builder().id("element_id_1").build(),
    })
  );
  state = reducer(
    state,
    actions.setElement({
      element: Element.builder()
        .id("element_id_2")
        .interfaceName("PlaceholderElement")
        .build(),
    })
  );

  state = reducer(
    state,
    actions.registerParent({
      ids: ["element_id_1", "element_id_2"],
      parentId: ROOT_ID,
    })
  );

  expect(state).toMatchSnapshot();

  state = reducer(
    state,
    actions.setElement({
      element: Element.builder()
        .id("element_id_2")
        .interfaceName("ButtonElement")
        .build(),
    })
  );

  state = reducer(
    state,
    actions.setElement({
      element: Element.builder().id("element_id_3").build(),
    })
  );

  state = reducer(
    state,
    actions.setElement({
      element: Element.builder().id("element_id_4").build(),
    })
  );

  state = reducer(
    state,
    actions.registerParent({
      ids: ["element_id_3", "element_id_4"],
      parentId: "element_id_2",
    })
  );

  expect(state).toMatchSnapshot();
});

test("delElement", () => {
  expect(
    reducer(
      {
        element_id: {
          element: Element.builder().id("element_id").build(),
        },
      },
      actions.delElement({
        id: "element_id",
        interfaceName: "Element",
      })
    )
  ).toMatchSnapshot();
});

test("delElement that is not connected to parent", () => {
  const state = {
    [ROOT_ID]: {
      element: Element.builder().id("element_id").build(),
      childs: ["child_element_id_1", "child_element_id_2"],
    },

    child_element_id_1: {
      parent: ROOT_ID,
      element: Element.builder().id("child_element_id_1").build(),
    },

    child_element_id_2: {
      parent: ROOT_ID,
      element: Element.builder().id("child_element_id_2").build(),
    },

    child_element_id_3: {
      parent: ROOT_ID,
      element: Element.builder().id("child_element_id_3").build(),
    },
  };

  expect(
    reducer(
      state,
      actions.delElement({
        id: "child_element_id_1",
        interfaceName: "Element",
      })
    )
  ).toMatchSnapshot();

  expect(
    reducer(
      state,
      actions.delElement({
        id: "child_element_id_2",
        interfaceName: "Element",
      })
    )
  ).toMatchSnapshot();

  expect(
    reducer(
      state,
      actions.delElement({
        id: "child_element_id_3",
        interfaceName: "Element",
      })
    )
  ).toMatchSnapshot();
});

describe("template logic", () => {
  let state = {};

  // init state
  test("should update initial state correctly", () => {
    state = reducer(
      state,
      actions.setElement({
        element: Element.builder().id("element_id_1").build(),
      })
    );
    state = reducer(
      state,
      actions.setElement({
        element: PlaceholderElement.builder()
          .id("element_id_2_place_holder")
          .build(),
      })
    );
    state = reducer(
      state,
      actions.setElement({
        element: LayoutElement.builder()
          .id("parent_element_id")
          .elements([
            Element.builder().id("element_id_1").build(),
            Element.builder().id("element_id_2_place_holder").build(),
          ])
          .build(),
      })
    );
    state = reducer(
      state,
      actions.registerParent({
        ids: ["element_id_1", "element_id_2_place_holder"],
        parentId: "parent_element_id",
      })
    );

    expect(state).toMatchSnapshot();
  });

  test("replaceElement should update state correctly", () => {
    state = reducer(
      state,
      actions.setElement({
        element: Element.builder().id("element_id_4").build(),
      })
    );
    state = reducer(
      state,
      actions.setElement({
        element: LayoutElement.builder()
          .id("element_id_3")
          .elements([Element.builder().id("element_id_4").build()])
          .build(),
      })
    );
    state = reducer(
      state,
      actions.registerParent({
        ids: ["element_id_4"],
        parentId: "element_id_3",
      })
    );

    expect(state).toMatchSnapshot();
  });

  test("replaceElement should work correctly", () => {
    state = reducer(
      state,
      actions.replaceElement({
        id: "element_id_3",
        oldId: "element_id_2_place_holder",
      })
    );

    expect(state).toMatchSnapshot();
  });
});
