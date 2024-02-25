"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Flex, Card, CardBody, Heading, Text, Image, Stack, useToast, Link, Box, Spinner, Select } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Line } from 'react-chartjs-2';
import { StoreIcon, LinkIcon } from "../../../components/icons";
import Header from "@/components/header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
);

interface ChartItem {
  createdAt: string,
  likes: number,
}

interface boothItem {
  id: string,
  name: string,
  img: string,
  price: number,
  shop_name: string,
  url: string,
}

export default function Items({ params }: { params: { id: string } }) {
  const cookies = parseCookies();
  const route = useRouter();
  const token = cookies.token;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [getOneItemInfo, setItemInfo] = useState<boothItem>({} as boothItem);
  const [getIntervalItemLogs, setItemLogs] = useState([]);
  const [interval, setInterval] = useState(15);
  const labels: string[] = [];
  const likesCnt: number[] = [];

  // Chart.jsオプション定義
  const chatrOption = {
    maintainAspectRatio: false,
    responsive: true,
  };

  // Chart.jsデータ挿入
  getIntervalItemLogs.forEach((item: ChartItem) => {
    labels.push("");
    likesCnt.push(item.likes);
  });

  // Chart.jsデータ
  const chartData = {
    labels,
    datasets: [
      {
        label: "スキ数",
        data: likesCnt,
        backgroundColor: "rgba(0, 133, 100, 0.5)",
        fill: false,
        pointradus: 5,
      }
    ]
  };

  // 時間間隔セレクトボックス
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChartLoading(true);
    setInterval(Number(event.target.value));
  };

  useEffect(() => {
    // ログイン確認
    if (!cookies.logged_in || cookies.logged_in !== "true") {
      return route.push('/login');
    }

    const fetchItemData = async () => {
      try {
        const itemInfo = await axios.get(process.env.API_ORIGIN + `booth/getOne?data_product_id=${params.id}`, {
          headers: {
            authorization: token
          }
        });
        const itemLogs = await axios.get(process.env.API_ORIGIN + `booth/getIntervalItemLogs?item_id=${params.id}&interval=${interval}`, {
          headers: {
            authorization: token
          }
        });
        setItemInfo(itemInfo.data);
        setItemLogs(itemLogs.data);
        setLoading(false)
        setChartLoading(false);
      } catch (error) {
        setCookie(null, "auth", "false");
        route.push("/dashboard");
        toast({
          title: "アイテムのデータが存在しません。",
          status: "warning",
          isClosable: true,
          position: "top-right"
        });
      }
    };
    fetchItemData();
  }, [interval]);
  return (
    <>
      <Header login={true} />
      {loading
        ?
        <Flex minWidth="100vw" minHeight="100vh" alignItems="center" justifyContent="center" flexDirection="column" background="blackAlpha.200">
          <Spinner size='xl' color="red.500" />
          <Text>Loading..</Text>
        </Flex>
        :
        <Flex alignItems="center" flexDirection="column" minHeight="100vh" background="blackAlpha.200">
          <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            shadow='lg'
            width={{ base: '95%', sm: '100%' }}
            maxW='900px'
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
                  <StoreIcon />
                  <Text px='2'>{getOneItemInfo.shop_name}</Text>
                </Flex>
                <Flex py="2" alignItems="center">
                  <LinkIcon />
                  <Link px='2' background="gray.50" rounded="md" href={getOneItemInfo.url} position="relative" zIndex="2">{getOneItemInfo.url}</Link>
                </Flex>
              </CardBody>
            </Stack>
          </Card>
          <Text fontSize="3xl" fontWeight="bold" my="5">発売からのスキ数推移</Text>
          <Select maxW={{ base: '95%', sm: "900px" }} bg='white' onChange={handleSelectChange}>
            <option value='15'>15分</option>
            <option value='30'>30分</option>
            <option value='60'>1時間</option>
            <option value='360'>6時間</option>
            <option value='720'>12時間</option>
            <option value='1440'>1日</option>
          </Select>
          {chartLoading
            ?
            <Flex width='900px' maxW={{ base: '95%', sm: "900px" }} height="450px" alignItems="center" flexDirection="column" justifyContent="center" position="relative" border="1px" borderColor="gray.200" bg="white" shadow="lg" rounded="lg" my={5}>
              <Spinner size='xl' color="red.500" />
              <Text>Loading..</Text>
            </Flex>
            :
            <Box width="100%" height="450px" maxW={{ base: '95%', sm: "900px" }} position="relative" border="1px" borderColor="gray.200" bg="white" shadow="lg" rounded="lg" my={5}>
              <Line options={chatrOption} data={chartData} />
            </Box>
          }
        </Flex>
      }
    </>
  )
}