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

const confirmStepFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  obs: z.string().nullable(),
});

type ConfirmStepFormData = z.infer<typeof confirmStepFormSchema>;

export const ConfirmStep = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmStepFormData>({
    resolver: zodResolver(confirmStepFormSchema),
  });

  function handleConfirm(data: ConfirmStepFormData) {
    console.log(data);
  }

  return (
    <ConfirmStepContainer as="form" onSubmit={handleSubmit(handleConfirm)}>
      <ConfirmStepHeader>
        <div>
          <CalendarBlank />
          <Text>22 de março de 2023</Text>
        </div>
        <div>
          <Clock />
          <Text>18h</Text>
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
        <Button variant="tertiary">Cancelar</Button>
        <Button type="submit">Confirmar</Button>
      </ConfirmStepActions>
    </ConfirmStepContainer>
  );
};
