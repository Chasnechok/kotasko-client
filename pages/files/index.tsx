import Head from 'next/head'
import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import Layout from '../../components/_layout'
import React, { Fragment, useState } from 'react'
import Lsi from '../../lsi/files-page.lst'
import ModeSelector from '../../components/filesPage/mode-selector'
import { useRouter } from 'next/router'
import DragArea from '../../components/filesPage/dragarea'
import UploadForm from '../../components/filesPage/upload-form'
import IUser, { UserStatesTypes } from '../../models/user'
import InfiniteList from '../../components/infinite-list'
import IFile from '../../models/file'
import FileComponent from '../../components/filesPage/file'
import axios from 'axios'
interface HomePageProps {
    userFromSession: IUser
    // force rerender when state changes
    userState: UserStatesTypes
}
export let MUTATE_FILE_LIST

const Home: React.FC<HomePageProps> = ({ userFromSession, userState }) => {
    const [userInputFiles, setUserInputFiles] = useState<FileList>()
    const router = useRouter()
    const showShared = router.query.hasOwnProperty('shared')

    function shouldRender(file: IFile) {
        if (!file) return false
        if (showShared) return file.shared.some((u) => u._id === userFromSession._id)
        return file.owner._id === userFromSession._id
    }

    return (
        <Layout userFromSession={userFromSession}>
            {(language, user) => (
                <Fragment>
                    <Head>
                        <title>Kotasko | {Lsi.pageName[language]}</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    {user && (
                        <Fragment>
                            <ModeSelector />
                            <section className="h-5/6">
                                {!showShared && (
                                    <div className="relative h-12 mt-8 mb-3">
                                        <DragArea forceRerender={userInputFiles} setFiles={setUserInputFiles} />
                                    </div>
                                )}
                                <UploadForm user={user} files={userInputFiles} setFiles={setUserInputFiles} />
                                <InfiniteList<IFile & React.FC>
                                    shouldRender={shouldRender}
                                    pageSize={20}
                                    fetchUrl="/files/list"
                                >
                                    {(file, mutate) => {
                                        // Workaround. Reason: useSWRInfinite doesn't support global mutate yet
                                        MUTATE_FILE_LIST = mutate
                                        if (!file) return null
                                        return <FileComponent user={userFromSession} file={file} />
                                    }}
                                </InfiniteList>
                            </section>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    try {
        const user = await axios.get<IUser>('http://localhost:5000/auth/checkSession', {
            headers: {
                Cookie: formatReqCookies(req),
            },
        })
        return {
            props: {
                userFromSession: user.data,
                userState: user.data.state,
            },
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

export default Home
