import Head from 'next/head'
import dynamic from 'next/dynamic'

export default function Home() {
    const DynamicComponentWithNoSSR = dynamic(
        () => import('../components/WarCryDisplay'),
        { ssr: false }
    )

    return (
        <div>
            <Head>
                <title>War Cry</title>
                <meta name="description" content="A skirmish game" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Welcome to War Cry!</h1>
                <DynamicComponentWithNoSSR />
            </main>
        </div>
    )
}
