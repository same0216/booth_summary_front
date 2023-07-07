"use client"

import axios from "axios";
import { Flex, Heading, Input, Button, Center, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";


export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const onsubmit = async (data) => {
    console.log(data.user, data.password);
    await axios({
      method: "post",
      url: "https://5573.me/users/login",
      data: {username: data.user, password: data.password}
    })

    .then((result => {
      console.log("成功", result.data.token);
    }))
    
    .catch((error => {
      console.log("失敗", error);
    }))
  } 

  return(
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6} textAlign="center">ログイン</Heading>
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