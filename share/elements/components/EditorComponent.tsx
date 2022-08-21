import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { produceWithPatches } from "immer";
import { LexicalEditor, EditorState as LexicalEditorState } from "lexical";
import _ from "lodash";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { actions } from "../../domain/engine";
import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import ToolbarPlugin from "./helpers/editor/ToolbarPlugin";
import EditorTheme from "./helpers/editor/theme";
import { Editor, EditorState } from "./widgets";

const editorConfig = {
  // The editor theme
  theme: EditorTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function EditorComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Editor);

  useElementEvent(element);

  const elementState = useElementState<EditorState>(element);
  const dispatch = useDispatch();

  const initialConfig = useMemo(
    () => ({
      namespace: `Editor_${element.id}`,
      editable: element.editable,
      editorState: (editor: LexicalEditor) => {
        if (elementState.value !== undefined) {
          editor.update(() => {
            editor.setEditorState(editor.parseEditorState(elementState.value));
          });
        }
      },
      ...editorConfig,
    }),
    [element]
  );
  const onChange = useMemo(
    () =>
      _.debounce((editorState: LexicalEditorState) => {
        const [, patches] = produceWithPatches(elementState, (draft) => {
          draft.value = editorState.toJSON();
        });

        dispatch(
          actions.updateStateElement({
            stateElementId: element.stateId,
            patches,
          })
        );
      }, 200),
    []
  );

  return (
    <div
      key={element.id}
      className={getElementClassName(element, "w-full h-full max-h-full")}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div className="w-full h-full rounded-sm text-black leading-5 font-normal text-left">
          {element.editable && <ToolbarPlugin />}
          <div
            className={
              (element.editable ? "max-h-[50vh] " : "") +
              "relative overflow-auto bg-white"
            }
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="w-full h-full min-h-[20vh] p-4 outline-none" />
              }
              placeholder={
                <div className="top-4 left-4 absolute text-sm select-none inline-block truncate pointer-events-none text-gray-500">
                  Enter some rich text...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
