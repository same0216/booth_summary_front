"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { Flex, Card, CardBody, Heading, Text, Image, Stack, useToast, Link, Box} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Bar } from 'react-chartjs-2';
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

interface Item {
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



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const cookies = parseCookies();
  const route = useRouter();
  const token = cookies.token;
  const toast = useToast();
  const [item, setItem] = useState<Item[]>([]);
  const [charts, setChart] = useState([]);
  const labels:string[] = [];
  const data1:number[] = [];

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
    }
  };

  charts.forEach((item: ChartItem) => {
    labels.push(item.date);
    data1.push(item.count);
  })

  const chart = {
    labels,
    datasets: [
      {
        label: "出品数",
        data: data1,
        backgroundColor: "rgba(0, 133, 100, 0.5)"
      }
    ]
  };

  useEffect(() => {
    if (Object.keys(cookies).length === 0) {
      return route.push('/login');
    } 
    const fetchData = async () => {
      try {
        const itemList = await axios.get("https://api.5573.me/booth/getTopItems?limit=10", {
          headers: {
            authorization: token
          }
        });
        const chart = await axios.get("https://api.5573.me/booth/getWeekSummary", {
          headers: {
            authorization: token
          }
        });
        setItem(itemList.data);
        setChart(chart.data);
      } catch (error) {
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
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <Text fontSize="3xl" fontWeight="bold" my="5">過去１週間のいいねランキング</Text>
      {item.map((item, index) => (
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
          {index === 0 && (
          <Image
            src="/images/1st.png"
            position="absolute"
            top="2"
            right="2"
          />
          )}
          {index === 1 && (
            <Image
              src="/images/2nd.png"
              position="absolute"
              top="2"
              right="2"
            />
          )}
          {index === 2 && (
            <Image
              src="/images/3nd.png"
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
              <Text py='2'>
                累計いいね数:{item.likes}
              </Text>
              <Text py='2'>
                ショップ名:{item.shop_name}
              </Text>
              <Text py='2'>
                アイテムURL:<Link href={item.url}>{item.url}</Link>
              </Text>
            </CardBody>
          </Stack>
        </Card>
      ))}
      <Text fontSize="3xl" fontWeight="bold" my="5">過去8日分の出品数チャート</Text>
      <Box width="100%" height="450px" maxWidth="900px" position="relative" border="1px" borderColor="gray.200" shadow="lg" rounded="lg" my={5}>
        <Bar options={options} data={chart}/>
      </Box>
    </Flex>
  );
}