"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Flex, Card, CardBody, Heading, Text, Image, Stack, useToast, Link, Box, Spinner} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Line } from 'react-chartjs-2';
import { StoreIcon, LinkIcon } from "../../../components/icons";
import Header from "@/components/header";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartItem {
  date: string,
  count: number,
}

interface boothItem {
  id: string,
  name: string,
  img: string,
  price: number,
  shop_name: string,
  url: string,
}

export default function Page({ params }: { params: { id: string } }) {
  const cookies = parseCookies();
  const route = useRouter();
  const token = cookies.token;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [getOneItemInfo, setItemInfo] = useState<boothItem>({} as boothItem);
  const [getIntervalItemLogs, setItemLogs] = useState([]);
  const labels:string[] = [];
  const likesCnt:number[] = [];

  //チャート系
  // const chatrOption: ChartOptions = {
  //   maintainAspectRatio: false,
  //   responsive: true,
  // };

  // getIntervalItemLogs.forEach((item: ChartItem) => {
  //   labels.push(item.date);
  //   likesCnt.push(item.count);
  // });

  // const chartData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "いいね推移",
  //       data: likesCnt,
  //       backgroundColor: "rgba(0, 133, 100, 0.5)"
  //     }
  //   ]
  // };

  useEffect(() => {
    if (Object.keys(cookies).length === 0) {
      return route.push('/login');
    }
    const fetchData = async () => {
      try {
        const itemInfo = await axios.get(process.env.API_ORIGIN +`booth/getOne?data_product_id=${params.id}`,{
          headers: {
            authorization: token
          }
        });
        const itemLogs = await axios.get(process.env.API_ORIGIN + `booth/getIntervalItemLogs?item_id=${params.id}&interval=15`,{
          headers: {
            authorization: token
          }
        });
        setItemInfo(itemInfo.data);
        setItemLogs(itemLogs.data);
        setLoading(false)
        console.log(itemLogs.data)
      } catch (error) {
        setCookie(null, "auth", "false");
        route.push("/login");
        toast({
          title: "セッションが切れています、再度ログインしてください",
          status: "error",
          isClosable: true,
          position: "top-right"
        });
      }
    };
    fetchData();
  }, []);
  return(
    <>
      <Header login={true}/>
      {loading ? 
      <Flex minWidth="100vw" minHeight="100vh" alignItems="center" justifyContent="center" flexDirection="column" background="blackAlpha.200">
        <Spinner color="red.500"/>
        <Text>Loading..</Text>
      </Flex> :
      <Flex alignItems="center" flexDirection="column" minHeight="100vh" background="blackAlpha.300">
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            shadow='lg'
            width='100%'
            maxWidth='900px'
            mt="16"
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={getOneItemInfo.img}
          />
            <Stack>
              <CardBody>
                <Heading size='md'>{getOneItemInfo.name}</Heading>
                <Flex py="2" alignItems="center">
                  <StoreIcon/>
                  <Text px='2'>{getOneItemInfo.shop_name}</Text>
                </Flex>
                <Flex py="2" alignItems="center">
                  <LinkIcon/>
                  <Link px='2' href={getOneItemInfo.url} position="relative" zIndex="2">{getOneItemInfo.url}</Link>
                </Flex>
              </CardBody>
            </Stack>
        </Card>
        {/* <Box width="100%" height="450px" maxWidth="900px" position="relative" border="1px" borderColor="gray.200" background="white" shadow="lg" rounded="lg" my={5}>
          <Line options={chatrOption} data={chartData}/>
        </Box>  */}
      </Flex>
      }
    </>
  )
}