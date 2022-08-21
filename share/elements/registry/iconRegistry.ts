import { ReactComponentLike } from "prop-types";
import { MdMoreHoriz, MdOutlineClear, MdOutlineEdit } from "react-icons/md";

export type IconType = "MdMoreHoriz" | "MdOutlineEdit" | "MdOutlineClear";

const ICON_REGISTRY: { [key in IconType]: ReactComponentLike } = {
  MdMoreHoriz,
  MdOutlineEdit,
  MdOutlineClear,
};

export function getIconComponent(iconName: string): ReactComponentLike {
  return ICON_REGISTRY[iconName];
}
