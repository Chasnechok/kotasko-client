import IUser, { UserRoleTypes } from '../../models/user'
import IChore, { ChoreStates } from '../../models/chore'
import Head from 'next/head'
import React, { Fragment, useState } from 'react'
import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import Lsi from '../../lsi/chores/index.lsi'
import Layout from '../../components/_layout'
import Listbox from '../../components/listbox'
import { useRouter } from 'next/router'
import ChoreExpanded from '../../components/choresPage/chore-expanded'
import InfiniteList from '../../components/infinite-list'
import ChoreComponent from '../../components/choresPage/chore-component'
import { PlusIcon } from '@heroicons/react/outline'
import ChoreCreateForm from '../../components/choresPage/chore-create-form'
import axios from 'axios'

export let MUTATE_CHORE_LIST

interface ChoresPageProps {
    userFromSession: IUser
}

const ChoresPage: React.FC<ChoresPageProps> = ({ userFromSession }) => {
    const router = useRouter()
    const [createFormOpened, setCreateFormOpened] = useState(false)
    const showActive = router.query.active == 'true' || !router.query.active
    function setShowActive(v: boolean) {
        router.query.active = v.toString()
        router.push({ pathname: router.pathname, query: router.query }, null, { shallow: true })
    }
    const selectedId = router.query.choreId

    function shouldRender(chore: IChore) {
        if (!chore) return false
        if (showActive) return chore.state !== ChoreStates.SOLVED
        return chore.state === ChoreStates.SOLVED
    }

    const options = [
        {
            label: 'Решенные',
            value: false,
        },
        {
            label: 'Активные',
            value: true,
        },
    ]

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
                            <ChoreCreateForm opened={createFormOpened} setOpened={setCreateFormOpened} />
                            <div className="flex items-center pt-2 justify-center md:justify-start">
                                <Listbox
                                    className="flex-1 max-w-2xs"
                                    options={options}
                                    value={showActive}
                                    setValue={setShowActive}
                                />
                                {!user.roles.includes(UserRoleTypes.TECHNICIAN) && showActive && (
                                    <button
                                        onClick={() => setCreateFormOpened(true)}
                                        className="ml-4 bg-blue-500 shadow-md hover:bg-blue-500/80 rounded-xl text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus-visible:ring-opacity-75"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <section className="flex h-5/6 justify-around mt-5">
                                <div className="flex-1 max-w-2xl">
                                    <InfiniteList<IChore & React.FC>
                                        shouldRender={shouldRender}
                                        fetchUrl="/chores/list"
                                        pageSize={10}
                                        emptyMessage="Здесь пока нет запросов"
                                    >
                                        {(chore, mutate) => {
                                            MUTATE_CHORE_LIST = mutate
                                            if (!chore) return null
                                            return <ChoreComponent mutateList={mutate} currUser={user} chore={chore} />
                                        }}
                                    </InfiniteList>
                                </div>
                                <div
                                    className={`flex-1 rounded border-dotted lg:transform-none transition-transform duration-300 lg:border-2 lg:max-w-2xl
                                absolute w-full md:px-4 h-full bottom-0 pt-16 lg:pt-2 md:pb-2 lg:relative ${
                                    selectedId ? '' : 'translate-x-full'
                                }
                                `}
                                >
                                    <ChoreExpanded user={user} choreId={selectedId as string} />
                                </div>
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

        if (!user.data?.department?.isServiceAllowed && !user.data?.roles.includes(UserRoleTypes.TECHNICIAN)) {
            return {
                redirect: {
                    destination: '/',
                    permanent: true,
                },
            }
        }
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

export default ChoresPage
