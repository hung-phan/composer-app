import { TableElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function TableElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, TableElement);

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
