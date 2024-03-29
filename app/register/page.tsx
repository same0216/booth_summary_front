"use client"

import axios from "axios";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, useToast, Text, Link } from "@chakra-ui/react";
import { useForm,  SubmitHandler, FieldValues  } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

type formInputs = {
  email: string;
  user: string;
  password: string;
}

export default function Register() {
  const route = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<formInputs>()

  // 新規登録処理
  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    await axios({
      method: "post",
      url: process.env.API_ORIGIN + "users/register",
      data: {email:data.email, username: data.user, password: data.password}
    })

    .then(() => {
      route.push("./login")
      toast({
        title: "新規登録に成功しました、受信したメールを確認してください。",
        status: "info",
        isClosable: true,
        position: "top-right"
      })
    })
    
    .catch((error) => {
      if (error.response.status === 400) {
        toast({
          title: error.response.data.msg,
          status: "error",
          isClosable: true,
          position: "top-right"
        })
      } else {
        toast({
          title: "新規登録に失敗しました、もう一度行ってください。",
          status: "error",
          isClosable: true,
          position: "top-right"
        })
      }

    })
  } 

  return(
    <>
      <Header/>
      <Flex direction="column" height="100vh" alignItems="center" justifyContent="center" background="blackAlpha.200">
        <Flex direction="column" background="white" shadow="base" p={12} rounded={6}>
          <Heading mb={6} textAlign="center">新規登録</Heading>
            <form onSubmit={handleSubmit(onsubmit)}>
              <FormControl isInvalid={Boolean(errors.email)}>
                <Input 
                  id="email"
                  placeholder="メールアドレス" 
                  variant="filled" 
                  type="email"
                  mt={6}
                  {...register('email',{
                    required: "メールアドレスを入力してください。",
                  })} 
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.user)}>
                <Input 
                  id="user"
                  placeholder="ユーザーID" 
                  variant="filled" 
                  type="text"
                  mt={6}
                  {...register('user',{
                    required: "ユーザーIDを入力してください。",
                    minLength: { value: 4, message: "4文字以上で入力してください。"},
                    pattern: { value: /^[0-9a-zA-Z]*$/, message: "ユーザー名は半角英数字で入力してください。"}
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
                    minLength: { value: 6, message: "6文字以上で入力してください。"},
                    maxLength: { value: 32, message: "32文字以内で入力してください。"},
                    pattern: { value: /^[0-9a-zA-Z]*$/, message: "パスワードは半角英数字で入力してください。"}
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
        <Text mt={5}>すでにアカウントをお持ちの方は<Link color="blue" href="./login">ログイン</Link>から。</Text>
      </Flex>
    </>
  );
}