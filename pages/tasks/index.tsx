import Head from 'next/head'
import React, { Fragment, useState } from 'react'
import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import Lsi from '../../lsi/tasks/index.lsi'
import Layout from '../../components/_layout'
import Listbox from '../../components/listbox'
import TaskCreateForm from '../../components/tasks/task-create-form/index'
import InfiniteList from '../../components/infinite-list'
import IUser from '../../models/user'
import ITask from '../../models/task'
import TaskComponent from '../../components/tasks/task-component'
import TaskExpanded from '../../components/tasks/task-expanded'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/outline'
import axios from 'axios'

export let MUTATE_TASK_LIST

interface TasksPageProps {
    userFromSession: IUser
}

const TasksPage: React.FC<TasksPageProps> = ({ userFromSession }) => {
    const [createFormOpened, setCreateFormOpened] = useState(false)
    const [showShared, setShowShared] = useState(false)
    const router = useRouter()
    const selectedId = router.query.taskId

    const options = [
        {
            label: 'Созданные вами',
            value: false,
        },
        {
            label: 'Порученные вам',
            value: true,
        },
    ]

    function shouldRender(task: ITask) {
        if (!task) return false
        if (showShared) return task.assignedTo.some((u) => u._id === userFromSession._id)
        return task.creator._id === userFromSession._id
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
                            <div className="flex items-center pt-2 justify-center md:justify-start">
                                <Listbox
                                    className="flex-1 max-w-2xs"
                                    options={options}
                                    value={showShared}
                                    setValue={setShowShared}
                                />
                                {!showShared && (
                                    <button
                                        onClick={() => setCreateFormOpened(true)}
                                        className="ml-4 bg-blue-500 shadow-md hover:bg-blue-500/80 rounded-xl text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus:ring-offset-2 focus-visible:ring-opacity-75"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <TaskCreateForm
                                setFormOpened={setCreateFormOpened}
                                formOpened={createFormOpened}
                                user={user}
                            />
                            {/* <button
                                onClick={() => setCreateFormOpened(true)}
                                className={`text-white bg-blue-500 z-10 hover:bg-blue-600 focus-visible:ring-blue-500 select-none transform md:transform-none font-medium
                             bottom-10 left-1/2 -translate-x-1/2 py-4 px-8 md:px-20 fixed lg:px-24 shadow-md rounded-full rounded-tl-none ring-offset-2 focus:outline-none focus:ring`}
                            >
                                Создать задание
                            </button> */}
                            <section className="flex h-5/6 justify-around mt-5">
                                <div className="flex-1 lg:max-w-2xl">
                                    <InfiniteList<ITask & React.FC>
                                        shouldRender={shouldRender}
                                        pageSize={20}
                                        fetchUrl="/tasks/list"
                                    >
                                        {(task, mutate) => {
                                            // Workaround. Reason: useSWRInfinite doesn't support global mutate yet
                                            MUTATE_TASK_LIST = mutate
                                            if (!task) return null
                                            return <TaskComponent currUser={user} task={task} />
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
                                    <TaskExpanded taskId={selectedId as string} user={user} />
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

export default TasksPage
