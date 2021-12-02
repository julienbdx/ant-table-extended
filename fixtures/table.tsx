import React from "react";
import { ColumnsType } from "antd/es/table";
import { Tag, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

// @ts-ignore
export { default as dataSource } from "./people-small";

export const columns: ColumnsType = [
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
    dataIndex: "country",
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
  },
];
