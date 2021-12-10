import React from "react";
import { Tag, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { PeoleType } from "./people-small";
import { ITableExtendedColumn } from "../components/TableExtended";

// @ts-ignore
export { default as dataSource } from "./people-small";

export const columns: ITableExtendedColumn<PeoleType> = [
  {
    title: "First Name",
    dataIndex: "firstName",
  },
  {
    dataIndex: "lastName",
    title: "Last Name",
  },
  {
    key: "country",
    dataIndex: "country",
    title: "Country",
  },
  {
    key: "abv",
    dataIndex: "abv",
    title: "Country abbreviation",
    render: (value) => {
      return (
        <Tag icon={<ArrowRightOutlined />}>
          <Typography>{value?.toUpperCase().slice(0, 2)}</Typography>
        </Tag>
      );
    },
    onFilter: (value: string, record: any) => {
      return record.country
        .toUpperCase()
        .slice(0, 2)
        .includes(value?.toUpperCase());
    },
    renderExport: (record) => {
      return record?.country.toUpperCase().slice(0, 2);
    },
  },
];
