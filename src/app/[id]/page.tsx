"use client";
import React from "react";
import {
  Button,
  Flex,
  Input,
  Radio,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export default function IdPage({ params }: { params: { id: Id<"projects"> } }) {
  const [nameAdmin, setNameAdmin] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [name, setName] = React.useState("");
  const [checkName, setCheckName] = React.useState(false);
  const [finish, setFinish] = React.useState(false);
  const [realSelections, setRealSelections] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(false);
  const [selectedPos, setSelectedPos] = React.useState(0);
  const selections = useQuery(api.selections.get, {
    project_id: params.id,
  });
  const project = useQuery(api.projects.get, {
    id: params.id,
  });
  const create = useMutation(api.selections.create);
  React.useEffect(() => {
    if (localStorage.getItem("dla") === process.env.NEXT_PUBLIC_ADMIN) {
      setAdmin(true);
    }
    if (localStorage.getItem("dist-name") !== null) {
      setCheckName(true);
      setName(localStorage.getItem("dist-name") || "");
    }
  }, []);

  React.useEffect(() => {
    if (project && !finish) {
      const now = new Date();
      if (now.getTime() > new Date(project.start).getTime()) {
        setFinish(true);
      }
    }
  }, [project]);

  React.useEffect(() => {
    if (project && selections) {
      const buffer: string[] = new Array(project.count).fill("");
      for (const el of selections) {
        buffer[el.position - 1] = el.name;
      }
      setRealSelections(buffer);
    }
  }, [selections, project]);

  React.useEffect(() => {
    if (project && localStorage.getItem("dist-selected") === project._id) {
      setSelected(true);
    }
  }, [project]);

  const select = async () => {
    if (selectedPos !== 0 && project) {
      const flag = await create({
        name,
        position: selectedPos,
        project_id: project._id,
      });
      if (flag) {
        localStorage.setItem("dist-selected", project._id);
        setSelected(true);
      }
    }
  };

  const selectAdmin = () => {
    if (selectedPos !== 0 && project && nameAdmin) {
      toast.promise(
        create({
          name: nameAdmin,
          position: selectedPos,
          project_id: project._id,
        }),
      );
      setNameAdmin("");
    }
  };

  if (!project || !selections || realSelections.length === 0) {
    return <Spin />;
  }

  if (admin) {
    return (
      <Flex gap="large" vertical align="center" justify="center">
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          {project.name}
        </Typography.Title>
        <Radio.Group
          buttonStyle="solid"
          size="large"
          onChange={(e) => {
            setSelectedPos(e.target.value);
          }}
        >
          <Space direction="vertical">
            {new Array(project.count)
              .fill(0)
              .map((_, i) => i + 1)
              .map((el, index) => {
                return (
                  <Space key={index}>
                    <Radio.Button
                      disabled={realSelections[index].length > 0}
                      style={{
                        width: 150,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black",
                      }}
                      value={el}
                    >
                      {el}
                    </Radio.Button>

                    {realSelections[index].length > 0 && (
                      <Tag color="#000">{realSelections[index]}</Tag>
                    )}
                  </Space>
                );
              })}
          </Space>
        </Radio.Group>
        <Space>
          <Input
            placeholder="Имя"
            size="large"
            value={nameAdmin}
            onChange={(e) => setNameAdmin(e.target.value)}
          />
          <Button type="primary" size="large" onClick={selectAdmin}>
            Отправить
          </Button>
        </Space>

        <Flex vertical gap={5}>
          {new Array(project.count)
            .fill(0)
            .map((_, i) => i + 1)
            .map((el, index) => {
              return (
                <Flex key={index}>
                  <Tag
                    color="#f1f1f1"
                    style={{
                      color: "black",
                      width: 50,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {el}
                  </Tag>
                  {realSelections[index].length > 0 && (
                    <Tag color="#000">{realSelections[index]}</Tag>
                  )}
                </Flex>
              );
            })}
        </Flex>
      </Flex>
    );
  }

  if (!checkName) {
    return (
      <Flex gap="large" vertical align="center" justify="center">
        <Typography.Title level={1} style={{ textAlign: "center" }}>
          Ваше имя
        </Typography.Title>
        <Space.Compact>
          <Input
            placeholder="Ваше имя"
            size="large"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            type="primary"
            disabled={!name}
            size="large"
            onClick={() => {
              if (name) {
                localStorage.setItem("dist-name", name);
                setCheckName(true);
                toast.success("Имя сохранено");
              }
            }}
          >
            Принять
          </Button>
        </Space.Compact>
        <Typography.Text type="secondary" style={{ textAlign: "center" }}>
          Эта информация сохранится в localstorage
        </Typography.Text>
      </Flex>
    );
  }

  if (!finish) {
    return (
      <Flex gap="small" vertical align="center" justify="center">
        <Typography.Text type="secondary" style={{ textAlign: "center" }}>
          До распределения {project.name} осталось
        </Typography.Text>
        <Statistic.Countdown
          value={new Date(project.start).getTime()}
          onFinish={() => setFinish(true)}
        />
      </Flex>
    );
  }

  return (
    <Flex gap="large" vertical align="center" justify="center">
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        {selected ? "Удачи" : "Распределение на " + project.name}
        <br />
        <Tag color="#000">{name}</Tag>
      </Typography.Title>
      {!selected && (
        <>
          <Typography.Text type="secondary" style={{ textAlign: "center" }}>
            Будьте внимательны, выбор нельзя изменить
          </Typography.Text>
          <Button type="primary" size="large" onClick={select}>
            Отправить
          </Button>
        </>
      )}
      <Radio.Group
        buttonStyle="solid"
        size="large"
        onChange={(e) => {
          setSelectedPos(e.target.value);
        }}
      >
        <Space direction="vertical">
          {new Array(project.count)
            .fill(0)
            .map((_, i) => i + 1)
            .map((el, index) => {
              return (
                <Space key={index}>
                  <Radio.Button
                    disabled={realSelections[index].length > 0}
                    style={{
                      width: 150,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "black",
                    }}
                    value={el}
                  >
                    {el}
                  </Radio.Button>

                  {realSelections[index].length > 0 && (
                    <Tag color="#000">{realSelections[index]}</Tag>
                  )}
                </Space>
              );
            })}
        </Space>
      </Radio.Group>
    </Flex>
  );
}
