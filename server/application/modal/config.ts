import { Builder } from "builder-pattern";
import { Element, Placeholder } from "share/domain/interfaces";
import {
  FragmentLayout,
  Modal,
  ModalState,
} from "share/elements/components/widgets";

export interface ModalConfig {
  stateId: string;
  headerPlaceholder: string;
  bodyPlaceholder: string;
  footerPlaceholder: string;
}

export const DEFAULT_MODAL_CONFIG = Builder<ModalConfig>()
  .stateId("DEFAULT_MODAL_CONFIG/stateId")
  .headerPlaceholder("DEFAULT_MODAL_CONFIG/headerPlaceholder")
  .bodyPlaceholder("DEFAULT_MODAL_CONFIG/bodyPlaceholder")
  .footerPlaceholder("DEFAULT_MODAL_CONFIG/footerPlaceholder")
  .build();

export function getDefaultModal(): Element {
  return FragmentLayout.builder()
    .items([
      ModalState.builder()
        .id(DEFAULT_MODAL_CONFIG.stateId)
        .size("xl")
        .show(false)
        .build(),
      Modal.builder()
        .stateId(DEFAULT_MODAL_CONFIG.stateId)
        .headerItem(
          Placeholder.builder()
            .id(DEFAULT_MODAL_CONFIG.headerPlaceholder)
            .build()
        )
        .bodyItem(
          Placeholder.builder().id(DEFAULT_MODAL_CONFIG.bodyPlaceholder).build()
        )
        .footerItem(
          Placeholder.builder()
            .id(DEFAULT_MODAL_CONFIG.footerPlaceholder)
            .build()
        )
        .build(),
    ])
    .build();
}
