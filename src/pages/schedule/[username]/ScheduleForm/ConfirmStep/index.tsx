import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import {
  ConfirmStepActions,
  ConfirmStepContainer,
  ConfirmStepHeader,
  ConfirmStepInputs,
  FormError,
} from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";

const confirmStepFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  obs: z.string().nullable(),
});

type ConfirmStepFormData = z.infer<typeof confirmStepFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmStepFormData>({
    resolver: zodResolver(confirmStepFormSchema),
  });

  const router = useRouter();
  const username = String(router.query.username);

  async function handleConfirm(data: ConfirmStepFormData) {
    const { email, name, obs } = data;

    try {
      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations: obs,
        date: schedulingDate,
      });

      onCancelConfirmation();
    } catch (error) {
      console.log(error);
    }
  }

  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");

  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <ConfirmStepContainer as="form" onSubmit={handleSubmit(handleConfirm)}>
      <ConfirmStepHeader>
        <div>
          <CalendarBlank />
          <Text>{describedDate}</Text>
        </div>
        <div>
          <Clock />
          <Text>{describedTime}</Text>
        </div>
      </ConfirmStepHeader>
      <ConfirmStepInputs>
        <label>
          <Text size="sm">Seu nome completo</Text>
          <TextInput
            size="sm"
            {...register("name")}
            placeholder="Digite seu nome"
          />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">E-mail</Text>
          <TextInput
            size="sm"
            placeholder="Digite seu endereço de e-mail"
            {...register("email")}
          />
          {errors.email && (
            <FormError size="sm">{errors.email.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">Observações</Text>
          <TextArea
            placeholder="Deixe aqui alguma observação"
            {...register("obs")}
          />
        </label>
      </ConfirmStepInputs>
      <ConfirmStepActions>
        <Button variant="tertiary" onClick={() => onCancelConfirmation()}>
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </ConfirmStepActions>
    </ConfirmStepContainer>
  );
}
