"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { Button, Card, Flex, Spin, Typography } from "antd";
export default function Home() {
  const [admin, setAdmin] = React.useState(false);
  const projects = useQuery(api.projects.getAll);
  React.useEffect(() => {
    if (localStorage.getItem("dla") === process.env.NEXT_PUBLIC_ADMIN) {
      setAdmin(true);
    }
  }, []);

  if (admin && projects) {
    return (
      <Flex gap="large" vertical align="center" justify="center">
        <Typography.Title level={1}>Проекты</Typography.Title>
        <Flex
          wrap="wrap"
          style={{ width: 900 }}
          align="center"
          justify="center"
          gap="small"
        >
          {projects.map((el) => {
            return (
              <Card key={el._id} hoverable>
                <Flex vertical justify="center" align="center" gap="large">
                  <Typography.Title level={3}>{el.name}</Typography.Title>
                  <Typography.Text type="secondary">
                    {new Date(el.start).toLocaleString()}
                  </Typography.Text>
                  <Link href={"/" + el._id}>
                    <Button type="dashed">Ссылка</Button>
                  </Link>
                </Flex>
              </Card>
            );
          })}
        </Flex>
        <Link href="/create">
          <Button>Создать</Button>
        </Link>
      </Flex>
    );
  }
  return <Spin />;
}
