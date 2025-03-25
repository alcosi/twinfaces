"use client";

import { TransitionScreen } from "@/screens/transition";

type TransitionPageProps = {
  params: {
    twinClassId: string;
    twinflowId: string;
    transitionId: string;
  };
};

export default function TransitionPage({ params }: TransitionPageProps) {
  return <TransitionScreen params={params} />;
}
