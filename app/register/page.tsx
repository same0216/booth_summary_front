"use client"

import axios from "axios";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const route = useRouter();
  const toast = useToast();

  const onsubmit = async (data) => {
    await axios({
      method: "post",
      url: "https://api.5573.me/users/register",
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
      console.log('失敗');
    })
  } 

  return(
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6} textAlign="center">新規登録</Heading>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl isInvalid={errors.user}>
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
            <FormControl isInvalid={errors.password}>
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
  );
}