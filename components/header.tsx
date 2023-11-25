
import { Flex, Button, Link, Box, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function Header({login = false}: {login?: boolean}){
  const route = useRouter();
  const toast = useToast()
  const logout = () => {
    destroyCookie(null, "auth");
    destroyCookie(null, "token");
    route.push("./login");
    toast({
      title: "ログアウトしました。",
      status: "info",
      isClosable: true,
      position: "top-right"
    })
  }

  return(
    <>
    {login ? 
      <Flex minW="full" height="12" bgGradient='linear(to-r, teal.500, green.500)' align="center" position="fixed" top="0" zIndex="100">
        <Box ml="5" fontSize="2xl" fontWeight="bold">
          <Link href="/dashboard" cursor="pointer" _hover={{ textDecoration: "none" }}>
            BoothSummary
          </Link>
        </Box>
        <Button colorScheme="facebook" size="md" ml="auto" mr="5" onClick={logout}>ログアウト</Button>
      </Flex>
      :
      <Flex minW="full" height="12" bgGradient='linear(to-r, teal.500, green.500)' align="center" position="fixed" top="0" zIndex="100">
        <Box ml="5" fontSize="2xl" fontWeight="bold">BoothSummary</Box>
      </Flex>
    }
    </>
    )
}