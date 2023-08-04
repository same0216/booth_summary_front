"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { Flex, Card, CardBody, Heading, Text, Image, Stack, useToast, Link, Box, Spinner} from "@chakra-ui/react";
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
import Header from "@/components/header";

interface ChartItem {
  date: string,
  count: number,
}


export default function Page({ params }: { params: { id: string } }) {
  const cookies = parseCookies();
  const route = useRouter();
  const token = cookies.token;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const labels:string[] = [];
  const data1:number[] = [];
  useEffect(() => {
    if (Object.keys(cookies).length === 0) {
      return route.push('/login');
    }
    const fetchData = async () => {
      try {
        const items = await axios.get(`https://api.5573.me/booth/getOne?data_product_id=${params.id}`,{
          headers: {
            authorization: token
          }
        });
        console.log(items)
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
      <div>My Post: {params.id}</div>
    </>
  ) 
}