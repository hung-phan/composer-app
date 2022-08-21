import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Table } from "./widgets";

export default function TableComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Table);

  useElementEvent(element);

  return (
    <table>
      <thead>
        <tr>
          {element.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {element.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((data, index) => (
              <td key={index}>{data}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
