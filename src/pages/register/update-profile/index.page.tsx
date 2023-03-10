import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from "@ignite-ui/react";
import { Header, RegisterContainer } from "../styles";
import { FormAnnotation, ProfileBox } from "./styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const session = useSession();
  const router = useRouter();

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put("/users/profile", {
      bio: data.bio,
    });

    await router.push(`/schedule/${session.data?.user.username}`);
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil" noindex />
      <RegisterContainer>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>
          <MultiStep size={4} currentStep={4} />
        </Header>
        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text>Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>
          <label>
            <Text>Sobre você</Text>
            <TextArea {...register("bio")} />
            <FormAnnotation>
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Finalizar
          </Button>
        </ProfileBox>
      </RegisterContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );
  return {
    props: {
      session,
    },
  };
};
