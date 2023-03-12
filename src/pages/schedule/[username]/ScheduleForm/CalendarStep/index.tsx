import { Calendar } from "@/components/Calendar";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import { useState } from "react";
import dayjs from "dayjs";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //const [availability, setAvailability] = useState<Availability | null>(null);

  const router = useRouter();

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const day = isDateSelected ? dayjs(selectedDate).format("DD") : null;
  const month = selectedDate ? dayjs(selectedDate).format("MMMM") : null;

  const username = String(router.query.username);

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability } = useQuery<Availability>(
    ["avaibility", selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });

      return response.data;
    },
    {
      enabled: !!selectedDate,
    }
  );

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSeleted={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay},{" "}
            <span>
              {day} de {month}
            </span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, "0")}:00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
