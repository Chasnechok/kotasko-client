import Head from 'next/head'
import formatReqCookies from '../../http/cookie'
import Layout from '@components/_layout'
import React, { Fragment, useState } from 'react'
import Lsi from '@lsi/files/index.lsi'
import { useRouter } from 'next/router'
import DragArea from '@components/filesPage/dragarea'
import UploadForm from '@components/filesPage/upload-form'
import IUser from '@models/user'
import InfiniteList from '@components/infinite-list'
import IFile from '@models/file'
import FileComponent from '@components/filesPage/file'
import axios from 'axios'
import Listbox from '@components/listbox'
interface HomePageProps {
    userFromSession: IUser
    // force rerender when state changes
}
export let MUTATE_FILE_LIST

const Home: React.FC<HomePageProps> = ({ userFromSession }) => {
    const [userInputFiles, setUserInputFiles] = useState<FileList>()
    const router = useRouter()
    const showShared = router.query.shared == 'true'
    const locale = router.locale

    function shouldRender(file: IFile) {
        if (!file) return false
        if (showShared) return file.shared?.some((u) => u._id === userFromSession._id)
        return file.owner?._id === userFromSession._id
    }

    function setShowShared(v: boolean) {
        router.query.shared = v.toString()
        router.push({ pathname: router.pathname, query: router.query }, null, { shallow: true })
    }

    const options = [
        {
            label: Lsi.yourFiles[locale],
            value: false,
        },
        {
            label: Lsi.sharedWithYou[locale],
            value: true,
        },
    ]

    return (
        <Layout userFromSession={userFromSession}>
            {(user) => (
                <Fragment>
                    <Head>
                        <title>Kotasko | {Lsi.pageName[locale]}</title>
                    </Head>
                    {user && (
                        <Fragment>
                            <Listbox
                                className="max-w-2xs mx-auto md:mx-0"
                                options={options}
                                value={showShared}
                                setValue={setShowShared}
                            />

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
