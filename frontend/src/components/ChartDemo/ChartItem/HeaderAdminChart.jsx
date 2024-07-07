import { Card } from "antd";
import React from "react";

const HeaderAdminChart = ({ title, quality }) => {
  return (
    <Card title={title}>
      <span style={{ fontSize: "20px", fontWeight: "600" }}>{quality}</span>
    </Card>
  );
};

export default HeaderAdminChart;