"use client"

import axios from "axios";
import React from "react";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, Toast, useToast } from "@chakra-ui/react";
import { setCookie } from "nookies";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";

type formInputs = {
  user: string;
  password: string;
}

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<formInputs>()

  const router = useRouter();
  const toast = useToast();

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {

    await axios({
      method: "post",
      url: "https://api.5573.me/users/login",
      data: {username: data.user, password: data.password}
    })

    .then((result => {
      setCookie(null, "token", result.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      router.push('/dashboard');
    }))
    
    .catch(() => {
       router.push('/login');
       toast({
        title: "ユーザーIDまたはパスワードが間違っています。",
        status: "error",
        isClosable: true,
        position: "top-right"
       })
    })
  } 

  return(
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6} textAlign="center">ログイン</Heading>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl isInvalid={Boolean(errors.user)}>
              <Input 
                id="user" 
                placeholder="ユーザーID" 
                variant="filled" 
                type="text"
                mt={6}
                {...register('user',{
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
                {...register('password',{
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
    </Flex>
  );
}