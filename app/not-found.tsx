"use client"

import { useRouter } from "next/router";
import { Box, Flex, Link, Image } from "@chakra-ui/react";
import Header from "@/components/header"

export default function Costom404() {
  return (
    <>
      <Header />
      <Flex background="blackAlpha.200"  height="100vh" width="100vw" alignItems="center" justifyContent="center" direction="column"  >
        <Image
          src="/images/himeso.png"
          objectFit="cover"
          maxW="500px"
          maxH="500px"
        />
        <Box fontSize="2xl" fontWeight="bold">404 Not Found!</Box>
        <Box>このページは利用できません。申し訳ありません。</Box>
        <Box>トップページは<Link href="/dashboard" color="blue.600">こちら</Link>です。</Box>
      </Flex>
    </>
  )
}