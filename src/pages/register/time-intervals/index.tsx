import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";

import { RegisterContainer, Header } from "../styles";
import {
  FormError,
  IntervalBox,
  IntervalDays,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from "./styles";
import { ArrowRight } from "phosphor-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekday: z.number(),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos um dia da semana!",
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekday,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message:
          "O horário de termino deve ser pelo menos 1hr distante do início.",
      }
    ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function ConnectCalendar() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekday: 0, enabled: false, startTime: "00:00", endTime: "18:00" },
        { weekday: 1, enabled: true, startTime: "00:00", endTime: "18:00" },
        { weekday: 2, enabled: true, startTime: "00:00", endTime: "18:00" },
        { weekday: 3, enabled: true, startTime: "00:00", endTime: "18:00" },
        { weekday: 4, enabled: true, startTime: "00:00", endTime: "18:00" },
        { weekday: 5, enabled: true, startTime: "00:00", endTime: "18:00" },
        { weekday: 6, enabled: false, startTime: "00:00", endTime: "18:00" },
      ],
    },
  });

  const intervals = watch("intervals");

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const router = useRouter();

  async function handleSetIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput;
    await api.post("/users/time-intervals", {
      intervals,
    });

    await router.push("/register/update-profile");
  }

  return (
    <RegisterContainer>
      <Header>
        <Heading as="strong">Defina sua disponibilidade</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>
      <IntervalBox as="form" onSubmit={handleSubmit(handleSetIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDays>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true);
                          }}
                          checked={field.value}
                        />
                      );
                    }}
                  />
                  <Text size="sm">{weekDays[field.weekday]}</Text>
                </IntervalDays>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            );
          })}
        </IntervalsContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          <Text>Próximo passo</Text>
          <ArrowRight />
        </Button>
      </IntervalBox>
    </RegisterContainer>
  );
}
