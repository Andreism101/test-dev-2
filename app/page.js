import Image from "next/image";
import { LotteryResults } from "./lottery-results";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1><b>Ultra Lotto 6/58 Results (Occurrence Table)</b></h1>
      <LotteryResults type="UL58" />
    </div>
  );
}
