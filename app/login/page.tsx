"use client"

import axios from "axios";
import Link from "next/link";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, useToast, Text } from "@chakra-ui/react";
import { setCookie, parseCookies } from "nookies";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


type formInputs = {
  user: string;
  password: string;
}

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<formInputs>()

  const route = useRouter();
  const toast = useToast();
  const cookies = parseCookies();

  useEffect(()=> {
    console.log(cookies);
    if (cookies.auth === "true") {
      return route.push('/dashboard');
    }
  },[]);

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
      setCookie(null, "auth", "true", {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      route.push('/dashboard');
    }))
    
    .catch(() => {
       route.push('/login');
       toast({
        title: "ユーザーIDまたはパスワードが間違っています。",
        status: "error",
        isClosable: true,
        position: "top-right"
       })
    })
  } 

  return(
    <Flex direction="column" height="100vh" alignItems="center" justifyContent="center">
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
      <Text>新規登録は<Link color="blue.500" href="./register">こちら</Link>から</Text>
    </Flex>
  );
}