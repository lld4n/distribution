"use client";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import React from "react";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  GetProps,
  Input,
  InputNumber,
} from "antd";
import { useRouter } from "next/navigation";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

export default function Create() {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [count, setCount] = React.useState(0);
  const create = useMutation(api.projects.create);
  const router = useRouter();
  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: string,
  ) => {
    setDate(dateString);
  };

  const handle = async () => {
    if (date && name && count) {
      await create({
        name,
        start: new Date(date).getTime(),
        count,
      });
      router.push("/");
    }
  };

  return (
    <Flex gap="large" vertical align="center" justify="center">
      <Input
        placeholder="Название проекта"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <DatePicker showTime onChange={onChange} />
      <InputNumber
        placeholder="Количество студентов"
        style={{ width: 200 }}
        min={1}
        max={100}
        onChange={(v) => {
          if (v) {
            setCount(v);
          }
        }}
      />
      <Button type="primary" onClick={handle}>
        Добавить
      </Button>
    </Flex>
  );
}
