"use client"

import axios from "axios";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, useToast, Text, Link } from "@chakra-ui/react";
import { setCookie, parseCookies } from "nookies";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";
import { off } from "process";

type formInputs = {
  user: string;
  password: string;
}

export default function Login() {
  const route = useRouter();
  const toast = useToast();
  const cookies = parseCookies();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<formInputs>()

  // ログイン済の場合TOP画面に遷移
  useEffect(() => {
    if (cookies.logged_in && cookies.logged_in !== "false") {
      return route.push('/dashboard');
    }
  }, []);

  // ログイン処理
  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    await axios({
      method: "post",
      url: process.env.API_ORIGIN + "users/login",
      data: { username: data.user, password: data.password }
    })
      .then((result => {
        setCookie(null, "logged_in", "true", {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })
        setCookie(null, "token", result.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

        route.push('/dashboard');
      }))
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            title: "ユーザーIDまたはパスワードが間違っているかメールアドレスが認証されていません。",
            status: "error",
            isClosable: true,
            position: "top-right"
          })
        }

      })
  }

  return (
    <>
      <Header />
      <Flex direction="column" height="100vh" alignItems="center" justifyContent="center" bg="blackAlpha.200">
        <Flex direction="column" background="white" shadow="base" p={12} rounded={6}>
          <Heading mb={6} textAlign="center">ログイン</Heading>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl isInvalid={Boolean(errors.user)}>
              <Input
                id="user"
                placeholder="ユーザーID"
                variant="filled"
                type="text"
                mt={6}
                {...register('user', {
                  required: "ユーザーIDを入力してください。",
                })}
              />
              <FormErrorMessage>
                {errors.user && errors.user.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <Input
                id="password"
                placeholder="パスワード"
                variant="filled"
                type="password"
                mt={6}
                {...register('password', {
                  required: "パスワードを入力してください。",
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt={6} colorScheme="teal" isLoading={isSubmitting} type="submit">送信</Button>
            </Center>
          </form>
        </Flex>
        <Text mt={5}>新規登録は<Link color="blue" href="./register">こちら</Link>から</Text>
      </Flex>
    </>
  );
}