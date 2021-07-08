import Head from 'next/head'
import dynamic from 'next/dynamic'

export default function Home() {
    const NoSSRWarCry = dynamic(() => import('../components/WarCryDisplay'), {
        ssr: false,
    })

    const NoSSRTetris = dynamic(() => import('../components/TetrisDisplay'), {
        ssr: false,
    })

    return (
        <div>
            <Head>
                <title>War Cry</title>
                <meta name="description" content="A skirmish game" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Welcome to War Cry!</h1>
                <NoSSRWarCry />
                <NoSSRTetris />
            </main>
        </div>
    )
}
