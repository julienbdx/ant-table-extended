import React from "react";
import { Table } from "antd";
import { TableProps } from "antd/lib/table/Table";

export type ITableUtils = {};
export type ITableProps<T> = TableProps<T> & ITableUtils;

export const TableExtended: React.FC<ITableProps<any>> = ({
  dataSource,
  columns,
  ...otherProps
}) => {
  return <Table dataSource={dataSource} columns={columns} {...otherProps} />;
};

export default TableExtended;
