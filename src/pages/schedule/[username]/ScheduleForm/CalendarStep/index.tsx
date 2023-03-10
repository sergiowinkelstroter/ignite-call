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
import { X } from "phosphor-react";

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //const [availability, setAvailability] = useState<Availability | null>(null);

  const router = useRouter();

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayjs(selectedDate).format("ddd") : null;
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

  const unavailableTimes = availability?.availableTimes.map((availableTime) => {
    return dayjs(availableTime).get("hour");
  });

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(dateWithTime);
  }

  function handleCloseTimePicker() {
    setSelectedDate(null);
  }

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
            <button onClick={handleCloseTimePicker}>
              <X size={22} />
            </button>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={
                    unavailableTimes?.includes(hour) ||
                    dayjs(selectedDate).set("hour", hour).isBefore(new Date())
                  }
                  onClick={() => handleSelectTime(hour)}
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
