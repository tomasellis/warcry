import Head from 'next/head'
import MainGame from '../components/WarCryGame'

export default function Home() {
    return (
        <div>
            <Head>
                <title>War Cry</title>
                <meta name="description" content="A skirmish game" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Welcome to War Cry!</h1>
                <MainGame />
            </main>
        </div>
    )
}
