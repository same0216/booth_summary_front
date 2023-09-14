"use client"

import axios from "axios";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useForm,  SubmitHandler, FieldValues  } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

type formInputs = {
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
      data: {username: data.user, password: data.password}
    })

    .then(() => {
      route.push("./login")
      toast({
        title: "新規登録に成功しました。",
        status: "success",
        isClosable: true,
        position: "top-right"
      })
    })
    
    .catch(() => {
      toast({
        title: "そのIDはすでに登録されています。",
        status: "error",
        isClosable: true,
        position: "top-right"
      })
    })
  } 

  return(
    <>
      <Header/>
      <Flex direction="column" height="100vh" alignItems="center" justifyContent="center" background="blackAlpha.200">
        <Flex direction="column" background="white" shadow="base" p={12} rounded={6}>
          <Heading mb={6} textAlign="center">新規登録</Heading>
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
      </Flex>
    </>
  );
}