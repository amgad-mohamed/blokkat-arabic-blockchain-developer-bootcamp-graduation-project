// import Vote from "@/components/Vote";
// import PollResults from "@/components/PollResults";
// import { GetPollName } from "@/components/GetPollName";
import { BookOpenIcon, ListCheckIcon, VoteIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/card";
import { Button } from "@/shared/Button";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Create Polls",
      description: "Create custom polls with multiple options in seconds",
      icon: <ListCheckIcon className="h-8 w-8 text-[#5d4ad5]" />,
    },
    {
      title: "Vote Easily",
      description: "Simple and intuitive voting interface for participants",
      icon: <VoteIcon className="h-8 w-8 text-[#5d4ad5]" />,
    },
    {
      title: "View Results",
      description: "See real-time results as votes come in",
      icon: <BookOpenIcon className="h-8 w-8 text-[#7f70e0]" />,
    },
  ];
  return (
    <div className=" flex flex-col bg-gradient-to-b from-[#f7f5fe56] to-[#e0dbfefb]">
      <div className="container px-10 p-4">
        <main className="flex-1 container mx-auto px-4 py-8">
          <section className="py-16 md:py-24 flex flex-col items-center text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-vote-dark">
              Simple Voting,{" "}
              <span className="text-[#5d4ad5]">Powerful Results</span>
            </h1>
            <p className="text-base md:text-xl max-w-2xl mb-10 text-gray-600">
              Create polls, gather votes, and analyze results with our
              easy-to-use platform. Perfect for teams, events, and decision
              making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-poll">
                <Button size="lg" variant="customBlue">
                  Create Poll
                </Button>
              </Link>
              <Link href={"/polls"}>
                <Button size="lg" variant="outline" className="px-8">
                  View Polls
                </Button>
              </Link>
            </div>
          </section>
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-vote-dark">
              Why Choose <span className="text-[#5d4ad5]">VotePulse</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border border-gray-200  bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-gray-200 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-[15px]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
        {/* <Vote />
        <PollResults />
        <GetPollName /> */}
      </div>
    </div>
  );
}
