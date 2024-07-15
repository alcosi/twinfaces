import Link from "next/link";

export default function Home() {
    return (
        <main className={"p-8 lg:flex lg:justify-center flex-col"}>
            <div className="w-0 flex-0 lg:w-16"/>
            <div className="flex-1">
                <h1>Welcome!</h1>
                <p>Start by creating new class on the <Link href="/twinclass" className="underline">Classes</Link> page.</p>
            </div>
            <div className="w-0 flex-0 lg:w-16"/>
        </main>
    );
}
