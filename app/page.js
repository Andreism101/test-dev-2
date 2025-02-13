import { LotteryResults } from './lottery-results';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1><b>Lottery Results (Occurrence Table)</b></h1>
      <LotteryResults />
    </div>
  );
}