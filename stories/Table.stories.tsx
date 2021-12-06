import * as React from "react";
import "antd/dist/antd.compact.min.css";
import { Table, TablePaginationConfig } from "antd";
import { TableProps } from "antd/lib/table/Table";
// @ts-ignore
import { columns, dataSource } from "../fixtures/table";
import TableExtended from "../src/components/TableExtended";
import { useState } from "react";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";

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
  const [selectedColumnsKeys, setSelectedColumnsKeys] = useState<string[]>([
    "firstName",
    "lastName",
    "abv",
  ]);

  const onTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => {
    console.log(pagination, filters, sorter, extra);
  };

  return (
    <TableExtended
      dataSource={dataSource}
      selectedColumnsKeys={selectedColumnsKeys}
      columns={columns}
      searchableColumnsKeys={["abv", "lastName"]}
      searchableByValueColumnsKeys={["firstName"]}
      sortableColumnsKeys={["firstName"]}
      setSelectedColumnsKeys={setSelectedColumnsKeys}
      onTableChange={onTableChange}
      defaultSetting={{
        pagination: { current: 2, pageSize: 5 },
        filters: { firstName: ["Al"] },
        sorter: {
          columnKey: "firstName",
          order: "descend",
        },
      }}
    />
  );
};
