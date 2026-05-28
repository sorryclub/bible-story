import GlossaryClient from "./GlossaryClient";

export const metadata = {
  title: "성경 사전",
  description:
    "복음·은혜·언약·속죄·유월절·메시아 등 성경을 이해하는 데 꼭 필요한 핵심 용어를 쉽게 풀이한 성경 용어 사전.",
};

export default async function GlossaryPage({ searchParams }) {
  const sp = await searchParams;
  const initialQuery = typeof sp?.term === "string" ? sp.term : "";
  return <GlossaryClient initialQuery={initialQuery} />;
}
