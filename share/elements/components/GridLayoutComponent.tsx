import { produceWithPatches } from "immer";
import _ from "lodash";
import { useCallback } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { useDispatch } from "react-redux";

import { IndexInCollection } from "../../domain/common";
import { actions } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { GridLayout, GridLayoutState } from "./widgets";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function GridLayoutComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, GridLayout);

  useElementEvent(element);

  const elementState = useElementState<GridLayoutState>(element);
  const dispatch = useDispatch();
  const onLayoutChange = useCallback(
    _.debounce((_currentLayout: Layout[], layouts: Layouts) => {
      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.layouts = layouts;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );
    }, 500),
    []
  );

  return (
    <ResponsiveGridLayout
      key={element.id}
      className="layout"
      layouts={elementState.layouts}
      useCSSTransforms={true}
      compactType={element.compactType}
      breakpoints={{ lg: 1280, md: 1024, sm: 768, xs: 640, xxs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={onLayoutChange}
      draggableHandle=".draggable-handle"
    >
      {element.items.map((nestedElement, index) => (
        <div key={nestedElement.id}>
          {renderElementInterface<IndexInCollection>(nestedElement, element, {
            indexInCollection: index,
          })}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
