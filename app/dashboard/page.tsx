import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Chart } from "@/components/Chart";

export default function sample() {
  return (
    <main className="min-h-screen">
      <Header />
      <article>
        <div className="flex flex-col justify-center items-center mt-11">
          <h1 className="text-2xl font-bold text-white my-4">週間伸び率ランキング</h1>
          <Card />
          <h1 className="text-2xl font-bold text-white my-4">今週の出品数</h1>
          <Chart />
        </div>
      </article>
    </main>
  );
}


