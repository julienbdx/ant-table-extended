import * as React from "react";
import "antd/dist/antd.compact.min.css";
import { Table } from "antd";
import { TableProps } from "antd/lib/table/Table";
// @ts-ignore
import { columns, dataSource } from "../fixtures/table";
import TableExtended from "../src/components/TableExtended";

export default {
  component: TableExtended,
  title: "Demos",
};

// // By passing optional props to this story, you can control the props of the component when
// // you consume the story in a test.

export const Default = (props: TableProps<any>) => {
  // Default table. Same as Ant Table
  return <Table dataSource={dataSource} columns={columns} {...props} />;
};

export const AntTableExtendedDefault = () => {
  return (
    <TableExtended
      dataSource={dataSource}
      selectedColumnsKeys={["firstName", "lastName"]}
      columns={columns}
      searchableColumnsKeys={["firstName"]}
      sortableColumnsKeys={["firstName"]}
    />
  );
};
