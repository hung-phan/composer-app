import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import _ from "lodash";
import { useDispatch } from "react-redux";

import { extractClientInfoFromProps } from "../../domain/common";
import { engineDispatch } from "../../domain/engine";
import { EngineComponentWithParentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { ContextMenu } from "./widgets";

export default function ContextMenuComponent(
  props: EngineComponentWithParentProps<any>
) {
  const element = useElementData(props.elementId, ContextMenu);

  useElementEvent(element);

  const dispatch = useDispatch();

  if (_.isEmpty(element.items)) {
    return null;
  }

  return (
    <Menu placement="bottom-start">
      <MenuHandler>
        <IconButton variant="text">
          {renderElementInterface(element.icon, element)}
        </IconButton>
      </MenuHandler>
      <MenuList>
        {element.items.map(({ description, methods }, index) => (
          <MenuItem key={index}>
            <a
              href="#"
              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() =>
                engineDispatch(
                  dispatch,
                  methods,
                  extractClientInfoFromProps(props.parentProps)
                )
              }
            >
              {description}
            </a>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
