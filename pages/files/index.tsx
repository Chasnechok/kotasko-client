import Head from 'next/head'
import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import Layout from '../_layout'
import { Fragment, useState } from 'react'
import Lsi from '../../lsi/files-page.lst'
import { useFiles } from '../../hooks/useFetchCollection'
import PuffLoader from 'react-spinners/PuffLoader'
import ModeSelector from '../../components/filesPage/mode-selector'
import FilesList from '../../components/filesPage/files-list'
import { useRouter } from 'next/router'
import DragArea from '../../components/filesPage/dragarea'
import UploadForm from '../../components/filesPage/upload-form'

export default function Home() {
    const { files, loading } = useFiles()
    const [userInputFiles, setUserInputFiles] = useState<FileList>()
    const router = useRouter()
    const showShared = router.query.hasOwnProperty('shared')

    return (
        <Layout>
            {(language, user) => (
                <Fragment>
                    <Head>
                        <title>Kotasko | {Lsi.pageName[language]}</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <PuffLoader
                        size="150px"
                        color="rgba(37, 99, 235)"
                        loading={loading}
                        css="display: block;margin: 0 auto;"
                    />
                    {files && user && (
                        <Fragment>
                            <ModeSelector router={router} showShared={showShared} />
                            {!showShared && (
                                <div className="relative h-12 mt-8">
                                    <DragArea setFiles={setUserInputFiles} />
                                </div>
                            )}
                            <UploadForm user={user} files={userInputFiles} setFiles={setUserInputFiles} />
                            <FilesList files={showShared ? files.hasAccess : files.owns} user={user} />
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    try {
        await $api.get('/auth/checkSession', {
            headers: {
                Cookie: formatReqCookies(req),
            },
        })
        return {
            props: {},
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
}
