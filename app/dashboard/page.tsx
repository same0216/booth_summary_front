"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Flex, Card, CardBody, Heading, Text, Image, Stack, useToast, Link, Box, Spinner} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Bar } from 'react-chartjs-2';
import { StoreIcon, LinkIcon, LikeIcon } from "../../components/icons";
import Header from "../../components/header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 型定義
interface boothItem {
  img: string;
  name: string;
  likes: number;
  shop_name: string;
  url: string;
}

interface ChartItem {
  date: string,
  count: number,
}

export default function Dashboard() {
  const cookies = parseCookies();
  const route = useRouter();
  const toast = useToast();
  const [topItemList, setItem] = useState<boothItem[]>([]);
  const [weekSummaryChart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const labels:string[] = [];
  const itemCnt:number[] = [];
  const token = cookies.token;
  
// Chart.jsオプション定義
  const chatrOption = {
    maintainAspectRatio: false,
    responsive: true,
  };

// Chart.jsデータ挿入
  weekSummaryChart.forEach((item: ChartItem) => {
    labels.push(item.date);
    itemCnt.push(item.count);
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: "出品数",
        data: itemCnt,
        backgroundColor: "rgba(0, 133, 100, 0.5)"
      }
    ]
  };

  useEffect(() => {
    // ログイン確認
    if (!cookies.logged_in || cookies.logged_in !== "true") {
      return route.push('/login');
    } 

    const fetchData = async () => {
      try {
        const itemList = await axios.get(process.env.API_ORIGIN + "booth/getTopItems", {
          headers: {
            authorization: token
          }
        });
        const weekSummary = await axios.get(process.env.API_ORIGIN + "booth/getWeekSummary", {
          headers: {
            authorization: token
          }
        });

        setItem(itemList.data);
        setChart(weekSummary.data);
        setLoading(false);
      } catch (error) {
        setCookie(null, "logged_in", "false");
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
      <Flex mt="12" alignItems="center" justifyContent="center" flexDirection="column" background="blackAlpha.200">
        <Text fontSize="3xl" fontWeight="bold" my="5">過去１週間のランキング</Text>
        {topItemList.map((item, index) => (
            <Card
              key={index}
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              shadow='lg'
              width='100%'
              maxWidth='900px'
              my={5}
              transition="transform 0.2s ease-in-out"
              _hover={{transform: "translateY(-5px)"}}
            >
              <Link href={"/items/" + item.url.split("/").pop()} position="absolute" width="100%" height="100%" cursor="pointer" zIndex="1"></Link>
              {index <= 2 && (
              <Image
                src={index === 0 ? "/images/1st.png" : index === 1 ? "/images/2nd.png" : "/images/3rd.png"}
                position="absolute"
                top="2"
                right="2"
              />
              )}
              <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                src={item.img}
              /> 
              <Stack>
                <CardBody>
                  <Heading size='md'>{item.name}</Heading>
                  <Flex py="2" alignItems="center">
                    <LikeIcon/>
                    <Text px='2'>{item.likes}</Text>
                  </Flex>
                  <Flex py="2" alignItems="center">
                    <StoreIcon/>
                    <Text px='2'>{item.shop_name}</Text>
                  </Flex>
                  <Flex py="2" alignItems="center">
                    <LinkIcon/>
                    <Link px='2' background="gray.50" rounded="md" href={item.url} position="relative" zIndex="2">{item.url}</Link>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
        ))}
        <Text fontSize="3xl" fontWeight="bold" my="5">過去8日間の出品数</Text>
        <Box width="100%" height="450px" maxWidth="900px" position="relative" border="1px" borderColor="gray.200" background="white" shadow="lg" rounded="lg" my={5}>
          <Bar options={chatrOption} data={chartData}/>
        </Box>
      </Flex>
      }
    </>
  );
}