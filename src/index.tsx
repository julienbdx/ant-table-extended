import TableExtended, { ITableUtils } from "./components/TableExtended";
import { TableProps } from "antd/lib/table/Table";

export type ITableProps<T> = TableProps<T> & ITableUtils;

export default TableExtended;
